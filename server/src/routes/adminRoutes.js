const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.use(verifyToken, requireAdmin);

router.get('/overview', adminController.getAdminOverview);
router.get('/students', adminController.getAllStudents);
router.post('/exams', adminController.addExam);
router.delete('/exams/:id', adminController.deleteExam);
router.post('/questions', adminController.addQuestion);
router.post('/current-affairs', adminController.createCurrentAffair);
router.post('/notifications', adminController.postNotification);

module.exports = router;

