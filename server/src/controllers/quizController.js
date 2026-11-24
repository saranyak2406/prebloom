const { query } = require('../database/db');

async function getPracticeQuestions(req, res) {
  try {
    const { subject_id, difficulty, limit } = req.query;
    const count = parseInt(limit) || 10;

    let sql = `
      SELECT 
        q.id, q.subject_id, q.topic_id, q.exam_id, q.question_text,
        q.option_a, q.option_b, q.option_c, q.option_d,
        q.difficulty, q.marks, q.negative_marks, q.previous_year_ref,
        s.name as subject_name, s.color as subject_color
      FROM questions q
      JOIN subjects s ON q.subject_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (subject_id && subject_id !== 'all') {
      params.push(subject_id);
      sql += ` AND q.subject_id = $${params.length}`;
    }

    if (difficulty && difficulty !== 'all') {
      params.push(difficulty);
      sql += ` AND q.difficulty = $${params.length}`;
    }

    params.push(count);
    sql += ` ORDER BY RANDOM() LIMIT $${params.length}`;

    const questionsRes = await query(sql, params);
    return res.json({ success: true, questions: questionsRes.rows });
  } catch (err) {
    console.error('getPracticeQuestions error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load practice questions.' });
  }
}

async function verifyAnswer(req, res) {
  try {
    const { question_id, selected_option } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!question_id || !selected_option) {
      return res.status(400).json({ success: false, message: 'Question ID and selected option are required.' });
    }

    const qRes = await query(`
      SELECT id, correct_option, explanation, marks, negative_marks, difficulty
      FROM questions WHERE id = $1
    `, [question_id]);

    if (qRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const question = qRes.rows[0];
    const isCorrect = question.correct_option.trim().toUpperCase() === selected_option.trim().toUpperCase();
    const score = isCorrect ? parseFloat(question.marks) : -parseFloat(question.negative_marks);

    return res.json({
      success: true,
      isCorrect,
      correctOption: question.correct_option,
      explanation: question.explanation,
      score,
      selectedOption: selected_option.toUpperCase()
    });
  } catch (err) {
    console.error('verifyAnswer error:', err);
    return res.status(500).json({ success: false, message: 'Failed to verify answer.' });
  }
}

module.exports = {
  getPracticeQuestions,
  verifyAnswer
};

