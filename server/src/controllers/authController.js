const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/db');
const { JWT_SECRET } = require('../middleware/auth');

async function register(req, res) {
  try {
    const { name, email, password, target_exam, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const avatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}`;

    const userRes = await query(`
      INSERT INTO users (name, email, password_hash, role, target_exam, phone, avatar)
      VALUES ($1, $2, $3, 'student', $4, $5, $6)
      RETURNING id, name, email, role, target_exam, avatar, streak_count, created_at
    `, [name.trim(), email.toLowerCase().trim(), passwordHash, target_exam || 'UPSC Civil Services', phone || null, avatar]);

    const user = userRes.rows[0];

    // Auto-create initial welcome notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES ($1, 'Welcome to PrepBloom 🌷', 'Your journey to your dream government career begins today! Explore exams and set your timetable.', 'system', '/exams')
    `, [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to PrepBloom.',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create account. Please try again.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const userRes = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update streak if active today
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.last_active_date ? new Date(user.last_active_date).toISOString().split('T')[0] : null;

    let newStreak = user.streak_count || 1;
    if (lastActive !== today) {
      newStreak = (user.streak_count || 0) + 1;
      await query('UPDATE users SET streak_count = $1, last_active_date = CURRENT_DATE WHERE id = $2', [newStreak, user.id]);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      target_exam: user.target_exam,
      streak_count: newStreak,
      created_at: user.created_at
    };

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Authentication failed. Please check credentials.' });
  }
}

async function getMe(req, res) {
  try {
    const userRes = await query(`
      SELECT id, name, email, role, avatar, phone, bio, target_exam, streak_count, created_at 
      FROM users WHERE id = $1
    `, [req.user.id]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, user: userRes.rows[0] });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
}

async function updateProfile(req, res) {
  try {
    const { name, bio, phone, target_exam, avatar } = req.body;

    const updateRes = await query(`
      UPDATE users 
      SET 
        name = COALESCE($1, name),
        bio = COALESCE($2, bio),
        phone = COALESCE($3, phone),
        target_exam = COALESCE($4, target_exam),
        avatar = COALESCE($5, avatar),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, name, email, role, avatar, phone, bio, target_exam, streak_count, updated_at
    `, [name, bio, phone, target_exam, avatar, req.user.id]);

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updateRes.rows[0]
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email.' });
    }

    const userRes = await query('SELECT id, name FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (userRes.rows.length === 0) {
      // Return 200 to prevent email enumeration
      return res.json({
        success: true,
        message: 'If an account exists with this email, password recovery instructions have been sent.'
      });
    }

    return res.json({
      success: true,
      message: 'Password reset instructions have been generated. (In demo environment: use your existing password or sign up a new account).'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to initiate password recovery.' });
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword
};
