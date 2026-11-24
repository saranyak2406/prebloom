const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { verifyToken } = require('../middleware/auth');

router.get('/categories', examController.getCategories);
router.get('/', examController.getExams);
router.get('/my-exams', verifyToken, examController.getMyExams);
router.post('/my-exams/toggle', verifyToken, examController.toggleMyExam);
router.post('/my-exams/favourite', verifyToken, examController.toggleFavourite);
router.post('/compare', examController.compareExams);
router.get('/:slug', examController.getExamBySlug);

module.exports = router;

