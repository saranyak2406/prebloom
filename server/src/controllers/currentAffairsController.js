const { query } = require('../database/db');

async function getCurrentAffairs(req, res) {
  try {
    const { category, search, month_year, trending } = req.query;

    let sql = `
      SELECT 
        id, title, category, summary, full_content, source, published_date,
        month_year, is_trending, tags, created_at
      FROM current_affairs
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (month_year && month_year !== 'all') {
      params.push(month_year);
      sql += ` AND month_year = $${params.length}`;
    }

    if (trending === 'true') {
      sql += ` AND is_trending = true`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(summary) LIKE $${params.length} OR LOWER(full_content) LIKE $${params.length})`;
    }

    sql += ` ORDER BY published_date DESC, id DESC`;

    const caRes = await query(sql, params);
    return res.json({ success: true, currentAffairs: caRes.rows });
  } catch (err) {
    console.error('getCurrentAffairs error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load current affairs.' });
  }
}

async function getCurrentAffairById(req, res) {
  try {
    const { id } = req.params;
    const caRes = await query('SELECT * FROM current_affairs WHERE id = $1', [id]);

    if (caRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Current affair article not found.' });
    }

    return res.json({ success: true, article: caRes.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load article.' });
  }
}

async function getCategories(req, res) {
  try {
    const catList = [
      { id: 'all', name: 'All Categories' },
      { id: 'national', name: 'National News' },
      { id: 'state', name: 'State News' },
      { id: 'andhra_pradesh', name: 'Andhra Pradesh' },
      { id: 'economy', name: 'Economy & Schemes' },
      { id: 'awards', name: 'Awards & Honors' },
      { id: 'sports', name: 'Sports News' },
      { id: 'appointments', name: 'Key Appointments' }
    ];
    return res.json({ success: true, categories: catList });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
}

module.exports = {
  getCurrentAffairs,
  getCurrentAffairById,
  getCategories
};
