const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.get('/dashboard', verifyToken, userController.getDashboardData);
router.get('/performance', verifyToken, userController.getPerformanceMetrics);
router.get('/bookmarks', verifyToken, userController.getBookmarks);
router.post('/bookmarks/toggle', verifyToken, userController.toggleBookmark);
router.get('/notifications', verifyToken, userController.getNotifications);
router.post('/notifications/:id/read', verifyToken, userController.markNotificationRead);

module.exports = router;
