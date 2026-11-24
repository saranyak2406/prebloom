const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { optionalAuth } = require('../middleware/auth');

router.get('/practice', quizController.getPracticeQuestions);
router.post('/verify', optionalAuth, quizController.verifyAnswer);

module.exports = router;
