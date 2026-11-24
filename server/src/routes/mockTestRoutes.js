const express = require('express');
const router = express.Router();
const mockTestController = require('../controllers/mockTestController');
const { verifyToken } = require('../middleware/auth');

router.get('/', mockTestController.getMockTests);
router.get('/history', verifyToken, mockTestController.getUserTestHistory);
router.get('/:id', mockTestController.getMockTestById);
router.post('/submit', verifyToken, mockTestController.submitMockTest);
router.get('/attempt/:attemptId', verifyToken, mockTestController.getAttemptResults);

module.exports = router;

