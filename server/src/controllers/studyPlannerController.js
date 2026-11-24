const { query } = require('../database/db');

async function getStudyPlan(req, res) {
  try {
    const userId = req.user.id;
    const planRes = await query(`
      SELECT sp.*, e.title as exam_title, e.slug as exam_slug
      FROM study_plans sp
      LEFT JOIN exams e ON sp.exam_id = e.id
      WHERE sp.user_id = $1 AND sp.is_active = true
      ORDER BY sp.created_at DESC
      LIMIT 1
    `, [userId]);

    if (planRes.rows.length === 0) {
      return res.json({ success: true, plan: null });
    }

    return res.json({ success: true, plan: planRes.rows[0] });
  } catch (err) {
    console.error('getStudyPlan error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch study plan.' });
  }
}

async function saveStudyPlan(req, res) {
  try {
    const userId = req.user.id;
    const { exam_id, title, target_date, daily_hours, schedule } = req.body;

    if (!title || !schedule) {
      return res.status(400).json({ success: false, message: 'Plan title and schedule are required.' });
    }

    const totalTasks = schedule.length;
    const completedTasks = schedule.filter(t => t.status === 'completed').length;

    // Deactivate previous plans
    await query('UPDATE study_plans SET is_active = false WHERE user_id = $1', [userId]);

    const planRes = await query(`
      INSERT INTO study_plans (
        user_id, exam_id, title, target_date, daily_hours, schedule_json, 
        completed_tasks, total_tasks, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
      RETURNING *
    `, [
      userId, exam_id || null, title, target_date || null,
      daily_hours || 4.0, JSON.stringify(schedule), completedTasks, totalTasks
    ]);

    return res.json({
      success: true,
      message: 'Study plan saved successfully! 🌸 Stay consistent!',
      plan: planRes.rows[0]
    });
  } catch (err) {
    console.error('saveStudyPlan error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save study plan.' });
  }
}

async function toggleTaskStatus(req, res) {
  try {
    const userId = req.user.id;
    const { planId, taskIndex } = req.body;

    const planRes = await query('SELECT * FROM study_plans WHERE id = $1 AND user_id = $2', [planId, userId]);
    if (planRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Study plan not found.' });
    }

    const plan = planRes.rows[0];
    const schedule = plan.schedule_json || [];

    if (taskIndex < 0 || taskIndex >= schedule.length) {
      return res.status(400).json({ success: false, message: 'Invalid task index.' });
    }

    const currentStatus = schedule[taskIndex].status;
    schedule[taskIndex].status = currentStatus === 'completed' ? 'pending' : 'completed';

    const completedTasks = schedule.filter(t => t.status === 'completed').length;

    const updateRes = await query(`
      UPDATE study_plans 
      SET schedule_json = $1, completed_tasks = $2
      WHERE id = $3
      RETURNING *
    `, [JSON.stringify(schedule), completedTasks, planId]);

    return res.json({
      success: true,
      plan: updateRes.rows[0]
    });
  } catch (err) {
    console.error('toggleTaskStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update task status.' });
  }
}

async function generateCombinedPlan(req, res) {
  try {
    const userId = req.user.id;
    const { examIds, targetMonths, dailyHours } = req.body;

    const targetH = dailyHours || 4;
    const months = targetMonths || 6;

    // Fetch subjects across all chosen exams
    const idsParam = examIds && examIds.length > 0 ? examIds.map((_, i) => `$${i + 1}`).join(',') : '1';
    const subjectsRes = await query(`
      SELECT DISTINCT s.id, s.name, s.slug
      FROM exam_subjects es
      JOIN subjects s ON es.subject_id = s.id
      ${examIds && examIds.length > 0 ? `WHERE es.exam_id IN (${idsParam})` : ''}
    `, examIds && examIds.length > 0 ? examIds : []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const generatedSchedule = [];

    const subjectsList = subjectsRes.rows.length > 0 ? subjectsRes.rows : [
      { name: 'Indian Polity & Governance' },
      { name: 'Indian Economy & Schemes' },
      { name: 'Quantitative Aptitude' },
      { name: 'Reasoning Ability' },
      { name: 'Current Affairs' }
    ];

    days.forEach((day, idx) => {
      if (day === 'Sunday') {
        generatedSchedule.push({
          day,
          time: '10:00 AM - 12:00 PM',
          subject: 'Weekly Revision & Mock Test',
          topic: 'Revise notes from Mon-Sat and attempt 1 Full Mock Test',
          status: 'pending'
        });
      } else {
        const sub1 = subjectsList[idx % subjectsList.length];
        const sub2 = subjectsList[(idx + 1) % subjectsList.length];

        generatedSchedule.push({
          day,
          time: '06:00 AM - 08:00 AM',
          subject: sub1.name,
          topic: `Core concepts, theory and chapter reading`,
          status: 'pending'
        });
        generatedSchedule.push({
          day,
          time: '08:30 PM - 09:30 PM',
          subject: sub2.name,
          topic: `Practice MCQs & Daily Current Affairs roundup`,
          status: 'pending'
        });
      }
    });

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);

    return res.json({
      success: true,
      title: `Combined Multi-Exam Preparation Plan (${months} Months)`,
      dailyHours: targetH,
      targetDate: targetDate.toISOString().split('T')[0],
      schedule: generatedSchedule
    });
  } catch (err) {
    console.error('generateCombinedPlan error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate combined plan.' });
  }
}

module.exports = {
  getStudyPlan,
  saveStudyPlan,
  toggleTaskStatus,
  generateCombinedPlan
};

