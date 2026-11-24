const { query } = require('../database/db');

async function getPYQPapers(req, res) {
  try {
    const { exam_id, year, search } = req.query;

    let sql = `
      SELECT 
        p.*,
        e.title as exam_title, e.slug as exam_slug, e.code as exam_code,
        c.name as category_name
      FROM pyq_papers p
      JOIN exams e ON p.exam_id = e.id
      JOIN exam_categories c ON e.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (exam_id && exam_id !== 'all') {
      params.push(exam_id);
      sql += ` AND p.exam_id = $${params.length}`;
    }

    if (year && year !== 'all') {
      params.push(year);
      sql += ` AND p.year = $${params.length}`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(p.title) LIKE $${params.length} OR LOWER(e.title) LIKE $${params.length})`;
    }

    sql += ` ORDER BY p.year DESC, p.id DESC`;

    const pyqRes = await query(sql, params);
    return res.json({ success: true, papers: pyqRes.rows });
  } catch (err) {
    console.error('getPYQPapers error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load PYQ papers.' });
  }
}

async function getPYQById(req, res) {
  try {
    const { id } = req.params;
    const pyqRes = await query(`
      SELECT 
        p.*,
        e.title as exam_title, e.slug as exam_slug, e.code as exam_code,
        c.name as category_name
      FROM pyq_papers p
      JOIN exams e ON p.exam_id = e.id
      JOIN exam_categories c ON e.category_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (pyqRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question paper not found.' });
    }

    return res.json({ success: true, paper: pyqRes.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load paper.' });
  }
}

module.exports = {
  getPYQPapers,
  getPYQById
};

