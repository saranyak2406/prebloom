const { query } = require('../database/db');

async function getMockTests(req, res) {
  try {
    const { exam_id, search } = req.query;

    let sql = `
      SELECT 
        mt.*,
        e.title as exam_title, e.slug as exam_slug, e.code as exam_code,
        c.name as category_name
      FROM mock_tests mt
      JOIN exams e ON mt.exam_id = e.id
      JOIN exam_categories c ON e.category_id = c.id
      WHERE mt.is_published = true
    `;
    const params = [];

    if (exam_id && exam_id !== 'all') {
      params.push(exam_id);
      sql += ` AND mt.exam_id = $${params.length}`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(mt.title) LIKE $${params.length} OR LOWER(mt.description) LIKE $${params.length})`;
    }

    sql += ` ORDER BY mt.created_at DESC`;

    const testsRes = await query(sql, params);
    return res.json({ success: true, mockTests: testsRes.rows });
  } catch (err) {
    console.error('getMockTests error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load mock tests.' });
  }
}

async function getMockTestById(req, res) {
  try {
    const { id } = req.params;

    const testRes = await query(`
      SELECT 
        mt.*,
        e.title as exam_title, e.slug as exam_slug, e.code as exam_code
      FROM mock_tests mt
      JOIN exams e ON mt.exam_id = e.id
      WHERE mt.id = $1
    `, [id]);

    if (testRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mock test not found.' });
    }

    const mockTest = testRes.rows[0];

    // Fetch questions without exposing correct_option
    const qRes = await query(`
      SELECT 
        q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
        q.marks, q.negative_marks, q.difficulty,
        s.name as subject_name,
        mtq.order_index
      FROM mock_test_questions mtq
      JOIN questions q ON mtq.question_id = q.id
      JOIN subjects s ON q.subject_id = s.id
      WHERE mtq.mock_test_id = $1
      ORDER BY mtq.order_index ASC
    `, [id]);

    mockTest.questions = qRes.rows;

    return res.json({ success: true, mockTest });
  } catch (err) {
    console.error('getMockTestById error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load mock test details.' });
  }
}

async function submitMockTest(req, res) {
  try {
    const userId = req.user.id;
    const { mock_test_id, answers, time_taken_seconds } = req.body;
    // answers format: { [question_id]: 'A' | 'B' | 'C' | 'D' }

    const testRes = await query('SELECT * FROM mock_tests WHERE id = $1', [mock_test_id]);
    if (testRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mock test not found.' });
    }
    const mockTest = testRes.rows[0];

    // Fetch official questions with correct options and explanations
    const qRes = await query(`
      SELECT 
        q.id, q.correct_option, q.marks, q.negative_marks, q.explanation, q.question_text,
        q.option_a, q.option_b, q.option_c, q.option_d,
        s.name as subject_name
      FROM mock_test_questions mtq
      JOIN questions q ON mtq.question_id = q.id
      JOIN subjects s ON q.subject_id = s.id
      WHERE mtq.mock_test_id = $1
      ORDER BY mtq.order_index ASC
    `, [mock_test_id]);

    const questions = qRes.rows;
    let attempted = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let totalScore = 0;

    const questionResults = questions.map(q => {
      const selected = answers ? answers[q.id] : null;
      let status = 'skipped';
      let marksAwarded = 0;

      if (selected) {
        attempted++;
        if (selected.toUpperCase() === q.correct_option.toUpperCase()) {
          correct++;
          status = 'correct';
          marksAwarded = parseFloat(q.marks || 1.0);
          totalScore += marksAwarded;
        } else {
          wrong++;
          status = 'wrong';
          marksAwarded = -parseFloat(q.negative_marks || mockTest.negative_marking_per_q || 0.33);
          totalScore += marksAwarded;
        }
      } else {
        skipped++;
      }

      return {
        question_id: q.id,
        question_text: q.question_text,
        options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
        selected_option: selected,
        correct_option: q.correct_option,
        explanation: q.explanation,
        status,
        marks_awarded: marksAwarded,
        subject_name: q.subject_name
      };
    });

    totalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    const percentage = Math.round((totalScore / mockTest.total_marks) * 100 * 10) / 10;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100 * 10) / 10 : 0;
    const isPassed = totalScore >= mockTest.passing_marks;

    // Save test attempt
    const attemptRes = await query(`
      INSERT INTO test_attempts (
        user_id, mock_test_id, exam_id, total_questions, attempted, correct_answers,
        wrong_answers, skipped, total_score, percentage, accuracy, time_taken_seconds,
        status, answers_json
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'completed', $13)
      RETURNING id, created_at
    `, [
      userId, mock_test_id, mockTest.exam_id, questions.length, attempted, correct,
      wrong, skipped, totalScore, percentage, accuracy, time_taken_seconds || 0,
      JSON.stringify(answers || {})
    ]);

    // Increment attempts_count on mock_tests
    await query(`
      UPDATE mock_tests 
      SET attempts_count = attempts_count + 1 
      WHERE id = $1
    `, [mock_test_id]);

    return res.json({
      success: true,
      attemptId: attemptRes.rows[0].id,
      summary: {
        totalQuestions: questions.length,
        attempted,
        correct,
        wrong,
        skipped,
        totalScore,
        maxMarks: mockTest.total_marks,
        passingMarks: mockTest.passing_marks,
        percentage,
        accuracy,
        isPassed,
        timeTakenSeconds: time_taken_seconds || 0,
        createdAt: attemptRes.rows[0].created_at
      },
      questionResults
    });
  } catch (err) {
    console.error('submitMockTest error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit mock test.' });
  }
}

async function getAttemptResults(req, res) {
  try {
    const { attemptId } = req.params;
    const userId = req.user.id;

    const attemptRes = await query(`
      SELECT 
        ta.*,
        mt.title as test_title, mt.total_marks, mt.passing_marks, mt.duration_minutes,
        e.title as exam_title
      FROM test_attempts ta
      JOIN mock_tests mt ON ta.mock_test_id = mt.id
      LEFT JOIN exams e ON ta.exam_id = e.id
      WHERE ta.id = $1 AND ta.user_id = $2
    `, [attemptId, userId]);

    if (attemptRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Attempt record not found.' });
    }

    const attempt = attemptRes.rows[0];

    // Fetch question details for review
    const qRes = await query(`
      SELECT 
        q.id, q.correct_option, q.marks, q.negative_marks, q.explanation, q.question_text,
        q.option_a, q.option_b, q.option_c, q.option_d,
        s.name as subject_name
      FROM mock_test_questions mtq
      JOIN questions q ON mtq.question_id = q.id
      JOIN subjects s ON q.subject_id = s.id
      WHERE mtq.mock_test_id = $1
      ORDER BY mtq.order_index ASC
    `, [attempt.mock_test_id]);

    const answers = attempt.answers_json || {};
    const questionReview = qRes.rows.map(q => {
      const selected = answers[q.id];
      const isCorrect = selected && selected.toUpperCase() === q.correct_option.toUpperCase();
      return {
        question_id: q.id,
        question_text: q.question_text,
        options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
        selected_option: selected,
        correct_option: q.correct_option,
        explanation: q.explanation,
        status: !selected ? 'skipped' : (isCorrect ? 'correct' : 'wrong'),
        subject_name: q.subject_name
      };
    });

    return res.json({
      success: true,
      attempt,
      questionReview
    });
  } catch (err) {
    console.error('getAttemptResults error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load attempt results.' });
  }
}

async function getUserTestHistory(req, res) {
  try {
    const userId = req.user.id;
    const historyRes = await query(`
      SELECT 
        ta.id, ta.total_questions, ta.attempted, ta.correct_answers, ta.wrong_answers,
        ta.total_score, ta.percentage, ta.accuracy, ta.time_taken_seconds, ta.created_at,
        mt.title as test_title, mt.total_marks, mt.passing_marks,
        e.title as exam_title, e.slug as exam_slug
      FROM test_attempts ta
      JOIN mock_tests mt ON ta.mock_test_id = mt.id
      LEFT JOIN exams e ON ta.exam_id = e.id
      WHERE ta.user_id = $1
      ORDER BY ta.created_at DESC
    `, [userId]);

    return res.json({ success: true, history: historyRes.rows });
  } catch (err) {
    console.error('getUserTestHistory error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch test history.' });
  }
}

module.exports = {
  getMockTests,
  getMockTestById,
  submitMockTest,
  getAttemptResults,
  getUserTestHistory
};
