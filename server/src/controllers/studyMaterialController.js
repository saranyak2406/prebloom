const { query } = require('../database/db');

async function getSubjects(req, res) {
  try {
    const subjectsRes = await query(`
      SELECT 
        s.*,
        COUNT(DISTINCT t.id) as topic_count,
        COUNT(DISTINCT l.id) as lesson_count,
        COUNT(DISTINCT sm.id) as material_count
      FROM subjects s
      LEFT JOIN topics t ON s.id = t.subject_id
      LEFT JOIN lessons l ON t.id = l.topic_id
      LEFT JOIN study_materials sm ON s.id = sm.subject_id
      GROUP BY s.id
      ORDER BY s.id ASC
    `);

    return res.json({ success: true, subjects: subjectsRes.rows });
  } catch (err) {
    console.error('getSubjects error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load subjects.' });
  }
}

async function getSubjectDetail(req, res) {
  try {
    const { slug } = req.params;
    const userId = req.user ? req.user.id : null;

    const subRes = await query('SELECT * FROM subjects WHERE slug = $1', [slug]);
    if (subRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Subject not found.' });
    }
    const subject = subRes.rows[0];

    // Fetch topics with lessons
    const topicsRes = await query(`
      SELECT 
        t.*,
        COUNT(l.id) as lesson_count
      FROM topics t
      LEFT JOIN lessons l ON t.id = l.topic_id
      WHERE t.subject_id = $1
      GROUP BY t.id
      ORDER BY t.display_order ASC, t.id ASC
    `, [subject.id]);

    const topicsWithLessons = [];
    for (const topic of topicsRes.rows) {
      const lessonsRes = await query(`
        SELECT 
          l.id, l.title, l.reading_time_mins, l.order_index, l.is_important, l.summary, l.key_points,
          COALESCE(up.status, 'not_started') as user_status
        FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
        WHERE l.topic_id = $2
        ORDER BY l.order_index ASC, l.id ASC
      `, [userId, topic.id]);

      topicsWithLessons.push({
        ...topic,
        lessons: lessonsRes.rows
      });
    }

    // Fetch study materials for this subject
    const materialsRes = await query(`
      SELECT * FROM study_materials WHERE subject_id = $1 ORDER BY download_count DESC
    `, [subject.id]);

    return res.json({
      success: true,
      subject,
      topics: topicsWithLessons,
      materials: materialsRes.rows
    });
  } catch (err) {
    console.error('getSubjectDetail error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch subject details.' });
  }
}

async function getLessonById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const lessonRes = await query(`
      SELECT 
        l.*, 
        t.name as topic_name, t.difficulty,
        s.name as subject_name, s.slug as subject_slug, s.color as subject_color,
        COALESCE(up.status, 'not_started') as user_status,
        EXISTS(SELECT 1 FROM bookmarks b WHERE b.user_id = $1 AND b.item_type = 'lesson' AND b.item_id = l.id) as is_bookmarked
      FROM lessons l
      JOIN topics t ON l.topic_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
      WHERE l.id = $2
    `, [userId, id]);

    if (lessonRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    return res.json({ success: true, lesson: lessonRes.rows[0] });
  } catch (err) {
    console.error('getLessonById error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load lesson.' });
  }
}

async function markLessonProgress(req, res) {
  try {
    const userId = req.user.id;
    const { lesson_id, topic_id, status } = req.body;

    if (!lesson_id || !topic_id) {
      return res.status(400).json({ success: false, message: 'Lesson ID and Topic ID are required.' });
    }

    const newStatus = status || 'completed';

    await query(`
      INSERT INTO user_progress (user_id, topic_id, lesson_id, status, time_spent_seconds, updated_at)
      VALUES ($1, $2, $3, $4, 450, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, topic_id, lesson_id)
      DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
    `, [userId, topic_id, lesson_id, newStatus]);

    return res.json({
      success: true,
      message: newStatus === 'completed' ? 'Lesson marked as completed! 🌸 Great job!' : 'Progress updated.',
      status: newStatus
    });
  } catch (err) {
    console.error('markLessonProgress error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update progress.' });
  }
}

async function getMaterials(req, res) {
  try {
    const { type, subject, search } = req.query;

    let sql = `
      SELECT 
        sm.*,
        s.name as subject_name, s.slug as subject_slug, s.color as subject_color
      FROM study_materials sm
      JOIN subjects s ON sm.subject_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (type && type !== 'all') {
      params.push(type);
      sql += ` AND sm.material_type = $${params.length}`;
    }

    if (subject && subject !== 'all') {
      params.push(subject);
      sql += ` AND s.slug = $${params.length}`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(sm.title) LIKE $${params.length} OR LOWER(sm.content_summary) LIKE $${params.length})`;
    }

    sql += ` ORDER BY sm.download_count DESC, sm.created_at DESC`;

    const matRes = await query(sql, params);
    return res.json({ success: true, materials: matRes.rows });
  } catch (err) {
    console.error('getMaterials error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load materials.' });
  }
}

async function incrementDownload(req, res) {
  try {
    const { id } = req.params;
    await query('UPDATE study_materials SET download_count = download_count + 1 WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Resource downloaded successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to track download.' });
  }
}

module.exports = {
  getSubjects,
  getSubjectDetail,
  getLessonById,
  markLessonProgress,
  getMaterials,
  incrementDownload
};
