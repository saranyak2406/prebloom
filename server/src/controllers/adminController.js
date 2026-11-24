const { query } = require('../database/db');

async function getAdminOverview(req, res) {
  try {
    const studentsCount = await query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const examsCount = await query("SELECT COUNT(*) as count FROM exams");
    const questionsCount = await query("SELECT COUNT(*) as count FROM questions");
    const mockTestsCount = await query("SELECT COUNT(*) as count FROM mock_tests");
    const attemptsCount = await query("SELECT COUNT(*) as count FROM test_attempts");
    const currentAffairsCount = await query("SELECT COUNT(*) as count FROM current_affairs");

    const recentStudents = await query(`
      SELECT id, name, email, target_exam, streak_count, created_at 
      FROM users WHERE role = 'student' 
      ORDER BY created_at DESC LIMIT 5
    `);

    const recentAttempts = await query(`
      SELECT ta.id, ta.total_score, ta.percentage, ta.accuracy, ta.created_at,
             u.name as student_name, u.email as student_email,
             mt.title as test_title
      FROM test_attempts ta
      JOIN users u ON ta.user_id = u.id
      JOIN mock_tests mt ON ta.mock_test_id = mt.id
      ORDER BY ta.created_at DESC LIMIT 6
    `);

    return res.json({
      success: true,
      stats: {
        totalStudents: parseInt(studentsCount.rows[0].count) || 0,
        totalExams: parseInt(examsCount.rows[0].count) || 0,
        totalQuestions: parseInt(questionsCount.rows[0].count) || 0,
        totalMockTests: parseInt(mockTestsCount.rows[0].count) || 0,
        totalAttempts: parseInt(attemptsCount.rows[0].count) || 0,
        totalArticles: parseInt(currentAffairsCount.rows[0].count) || 0
      },
      recentStudents: recentStudents.rows,
      recentAttempts: recentAttempts.rows
    });
  } catch (err) {
    console.error('getAdminOverview error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load admin overview.' });
  }
}

async function getAllStudents(req, res) {
  try {
    const studentsRes = await query(`
      SELECT 
        u.id, u.name, u.email, u.phone, u.target_exam, u.streak_count, u.created_at,
        COUNT(DISTINCT ta.id) as test_count,
        COALESCE(AVG(ta.accuracy), 0) as avg_accuracy
      FROM users u
      LEFT JOIN test_attempts ta ON u.id = ta.user_id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    return res.json({ success: true, students: studentsRes.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load students.' });
  }
}

async function addExam(req, res) {
  try {
    const {
      category_id, slug, title, code, overview, eligibility, age_criteria,
      educational_qualification, selection_process, exam_pattern, detailed_syllabus,
      official_notification_link, notification_status, vacancies, salary_range, is_featured
    } = req.body;

    if (!title || !slug || !overview) {
      return res.status(400).json({ success: false, message: 'Title, slug and overview are required.' });
    }

    const resExam = await query(`
      INSERT INTO exams (
        category_id, slug, title, code, overview, eligibility, age_criteria,
        educational_qualification, selection_process, exam_pattern, detailed_syllabus,
        official_notification_link, notification_status, vacancies, salary_range, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      category_id || 1, slug.toLowerCase().trim(), title, code || null, overview,
      eligibility || 'Graduation', age_criteria || '21-32 years',
      educational_qualification || 'Bachelor degree', selection_process || 'Prelims, Mains, Interview',
      JSON.stringify(exam_pattern || { stages: [] }), JSON.stringify(detailed_syllabus || { syllabus: [] }),
      official_notification_link || 'https://upsc.gov.in', notification_status || 'active',
      vacancies || 0, salary_range || 'Standard Govt Pay Scale', is_featured || false
    ]);

    return res.status(201).json({
      success: true,
      message: 'New examination created successfully!',
      exam: resExam.rows[0]
    });
  } catch (err) {
    console.error('addExam error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add exam: ' + err.message });
  }
}

async function deleteExam(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM exams WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Exam deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete exam.' });
  }
}

async function addQuestion(req, res) {
  try {
    const {
      subject_id, topic_id, question_text, option_a, option_b, option_c, option_d,
      correct_option, explanation, difficulty, marks, negative_marks, previous_year_ref
    } = req.body;

    if (!subject_id || !question_text || !option_a || !option_b || !correct_option) {
      return res.status(400).json({ success: false, message: 'Question, options and correct answer are required.' });
    }

    const qRes = await query(`
      INSERT INTO questions (
        subject_id, topic_id, question_text, option_a, option_b, option_c, option_d,
        correct_option, explanation, difficulty, marks, negative_marks, previous_year_ref
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      subject_id, topic_id || null, question_text, option_a, option_b, option_c, option_d,
      correct_option.toUpperCase(), explanation || 'Detailed explanation',
      difficulty || 'medium', marks || 1.0, negative_marks || 0.33, previous_year_ref || null
    ]);

    return res.status(201).json({
      success: true,
      message: 'Question added to question bank!',
      question: qRes.rows[0]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add question.' });
  }
}

async function createCurrentAffair(req, res) {
  try {
    const { title, category, summary, full_content, source, published_date, month_year, is_trending, tags } = req.body;

    if (!title || !category || !summary) {
      return res.status(400).json({ success: false, message: 'Title, category, and summary are required.' });
    }

    const caRes = await query(`
      INSERT INTO current_affairs (
        title, category, summary, full_content, source, published_date, month_year, is_trending, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      title, category, summary, full_content || summary, source || 'Official Release',
      published_date || new Date().toISOString().split('T')[0],
      month_year || 'November 2026', is_trending || false, tags || []
    ]);

    return res.status(201).json({
      success: true,
      message: 'Current affairs published successfully!',
      article: caRes.rows[0]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to publish current affair.' });
  }
}

async function postNotification(req, res) {
  try {
    const { title, message, type, link } = req.body;

    // Send to all students
    const students = await query("SELECT id FROM users WHERE role = 'student'");
    for (const student of students.rows) {
      await query(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES ($1, $2, $3, $4, $5)
      `, [student.id, title, message, type || 'exam_alert', link || '/exams']);
    }

    return res.json({
      success: true,
      message: `Notification broadcasted to ${students.rows.length} students!`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to broadcast notification.' });
  }
}

module.exports = {
  getAdminOverview,
  getAllStudents,
  addExam,
  deleteExam,
  addQuestion,
  createCurrentAffair,
  postNotification
};
