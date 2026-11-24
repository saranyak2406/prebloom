const { query } = require('../database/db');

async function getCategories(req, res) {
  try {
    const categoriesRes = await query(`
      SELECT 
        c.id, c.slug, c.name, c.icon, c.description, c.display_order,
        COUNT(e.id) as exam_count
      FROM exam_categories c
      LEFT JOIN exams e ON c.id = e.category_id
      GROUP BY c.id, c.slug, c.name, c.icon, c.description, c.display_order
      ORDER BY c.display_order ASC
    `);

    return res.json({ success: true, categories: categoriesRes.rows });
  } catch (err) {
    console.error('getCategories error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load categories.' });
  }
}

async function getExams(req, res) {
  try {
    const { category, search, status, featured } = req.query;

    let sql = `
      SELECT 
        e.id, e.category_id, e.slug, e.title, e.code, e.overview, e.eligibility, 
        e.age_criteria, e.educational_qualification, e.selection_process,
        e.official_notification_link, e.notification_status, e.notification_date, 
        e.application_deadline, e.vacancies, e.salary_range, e.is_featured,
        c.name as category_name, c.slug as category_slug, c.icon as category_icon
      FROM exams e
      JOIN exam_categories c ON e.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      sql += ` AND c.slug = $${params.length}`;
    }

    if (status && status !== 'all') {
      params.push(status);
      sql += ` AND e.notification_status = $${params.length}`;
    }

    if (featured === 'true') {
      sql += ` AND e.is_featured = true`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(e.title) LIKE $${params.length} OR LOWER(e.code) LIKE $${params.length} OR LOWER(e.overview) LIKE $${params.length})`;
    }

    sql += ` ORDER BY e.is_featured DESC, e.created_at DESC`;

    const examsRes = await query(sql, params);
    return res.json({ success: true, exams: examsRes.rows });
  } catch (err) {
    console.error('getExams error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load exams.' });
  }
}

async function getExamBySlug(req, res) {
  try {
    const { slug } = req.params;
    const examRes = await query(`
      SELECT 
        e.*, 
        c.name as category_name, c.slug as category_slug, c.icon as category_icon
      FROM exams e
      JOIN exam_categories c ON e.category_id = c.id
      WHERE e.slug = $1
    `, [slug]);

    if (examRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Examination not found.' });
    }

    const exam = examRes.rows[0];

    // Fetch linked subjects
    const subjectsRes = await query(`
      SELECT s.id, s.slug, s.name, s.code, s.icon, s.color, s.description, es.weightage, es.is_mandatory
      FROM subjects s
      JOIN exam_subjects es ON s.id = es.subject_id
      WHERE es.exam_id = $1
      ORDER BY es.weightage DESC
    `, [exam.id]);

    // Fetch available mock tests count
    const mockRes = await query(`
      SELECT COUNT(*) as count FROM mock_tests WHERE exam_id = $1
    `, [exam.id]);

    // Fetch PYQ count
    const pyqRes = await query(`
      SELECT COUNT(*) as count FROM pyq_papers WHERE exam_id = $1
    `, [exam.id]);

    exam.subjects = subjectsRes.rows;
    exam.mock_tests_count = parseInt(mockRes.rows[0].count) || 0;
    exam.pyq_count = parseInt(pyqRes.rows[0].count) || 0;

    return res.json({ success: true, exam });
  } catch (err) {
    console.error('getExamBySlug error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load exam details.' });
  }
}

async function getMyExams(req, res) {
  try {
    const userId = req.user.id;
    const myExamsRes = await query(`
      SELECT 
        ue.id as user_exam_id, ue.is_favourite, ue.is_primary, ue.preparation_percentage, ue.added_at,
        e.id, e.slug, e.title, e.code, e.vacancies, e.notification_status, e.application_deadline, e.salary_range,
        c.name as category_name, c.slug as category_slug
      FROM user_exams ue
      JOIN exams e ON ue.exam_id = e.id
      JOIN exam_categories c ON e.category_id = c.id
      WHERE ue.user_id = $1
      ORDER BY ue.is_primary DESC, ue.is_favourite DESC, ue.added_at DESC
    `, [userId]);

    return res.json({ success: true, myExams: myExamsRes.rows });
  } catch (err) {
    console.error('getMyExams error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch enrolled exams.' });
  }
}

async function toggleMyExam(req, res) {
  try {
    const userId = req.user.id;
    const { exam_id } = req.body;

    if (!exam_id) {
      return res.status(400).json({ success: false, message: 'Exam ID is required.' });
    }

    const check = await query('SELECT id FROM user_exams WHERE user_id = $1 AND exam_id = $2', [userId, exam_id]);

    if (check.rows.length > 0) {
      // Remove
      await query('DELETE FROM user_exams WHERE user_id = $1 AND exam_id = $2', [userId, exam_id]);
      return res.json({ success: true, action: 'removed', message: 'Exam removed from My Exams.' });
    } else {
      // Add
      await query('INSERT INTO user_exams (user_id, exam_id, preparation_percentage) VALUES ($1, $2, 10)', [userId, exam_id]);
      return res.json({ success: true, action: 'added', message: 'Exam added to My Exams! Study plan updated.' });
    }
  } catch (err) {
    console.error('toggleMyExam error:', err);
    return res.status(500).json({ success: false, message: 'Failed to toggle exam enrolment.' });
  }
}

async function toggleFavourite(req, res) {
  try {
    const userId = req.user.id;
    const { exam_id } = req.body;

    const resCheck = await query('SELECT is_favourite FROM user_exams WHERE user_id = $1 AND exam_id = $2', [userId, exam_id]);
    if (resCheck.rows.length === 0) {
      // Insert as favourite
      await query('INSERT INTO user_exams (user_id, exam_id, is_favourite, preparation_percentage) VALUES ($1, $2, true, 10)', [userId, exam_id]);
      return res.json({ success: true, is_favourite: true });
    } else {
      const newFav = !resCheck.rows[0].is_favourite;
      await query('UPDATE user_exams SET is_favourite = $1 WHERE user_id = $2 AND exam_id = $3', [newFav, userId, exam_id]);
      return res.json({ success: true, is_favourite: newFav });
    }
  } catch (err) {
    console.error('toggleFavourite error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update favourite status.' });
  }
}

async function compareExams(req, res) {
  try {
    const { examIds } = req.body; // array of exam IDs e.g. [1, 5]

    if (!examIds || !Array.isArray(examIds) || examIds.length < 2) {
      return res.status(400).json({ success: false, message: 'Please select at least 2 examinations to compare.' });
    }

    const idsParam = examIds.map((_, i) => `$${i + 1}`).join(',');
    const examsRes = await query(`
      SELECT e.*, c.name as category_name 
      FROM exams e
      JOIN exam_categories c ON e.category_id = c.id
      WHERE e.id IN (${idsParam})
    `, examIds);

    // Fetch subjects for each exam
    const subjectsRes = await query(`
      SELECT es.exam_id, s.id as subject_id, s.name as subject_name, s.code, es.weightage
      FROM exam_subjects es
      JOIN subjects s ON es.subject_id = s.id
      WHERE es.exam_id IN (${idsParam})
    `, examIds);

    // Group subjects by subject_id to find common subjects
    const subjectMap = {};
    for (const sub of subjectsRes.rows) {
      if (!subjectMap[sub.subject_id]) {
        subjectMap[sub.subject_id] = {
          subject_name: sub.subject_name,
          exams: []
        };
      }
      subjectMap[sub.subject_id].exams.push(sub.exam_id);
    }

    const commonSubjects = Object.values(subjectMap)
      .filter(s => s.exams.length === examIds.length)
      .map(s => s.subject_name);

    return res.json({
      success: true,
      exams: examsRes.rows,
      commonSubjects,
      allSubjectsMapping: subjectMap
    });
  } catch (err) {
    console.error('compareExams error:', err);
    return res.status(500).json({ success: false, message: 'Failed to compare examinations.' });
  }
}

module.exports = {
  getCategories,
  getExams,
  getExamBySlug,
  getMyExams,
  toggleMyExam,
  toggleFavourite,
  compareExams
};

