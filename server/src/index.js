const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initDb } = require('./database/db');
const { seed } = require('./database/seed');

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');
const quizRoutes = require('./routes/quizRoutes');
const mockTestRoutes = require('./routes/mockTestRoutes');
const currentAffairsRoutes = require('./routes/currentAffairsRoutes');
const pyqRoutes = require('./routes/pyqRoutes');
const studyPlannerRoutes = require('./routes/studyPlannerRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/mock-tests', mockTestRoutes);
app.use('/api/current-affairs', currentAffairsRoutes);
app.use('/api/pyq', pyqRoutes);
app.use('/api/planner', studyPlannerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'PrepBloom - Indian Government Exam Preparation Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend client dist if built
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

async function startServer() {
  try {
    console.log('🌸 Initializing PrepBloom database...');
    await initDb();
    await seed();

    app.listen(PORT, () => {
      console.log(`🚀 PrepBloom Backend API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start PrepBloom server:', err);
    process.exit(1);
  }
}

startServer();
