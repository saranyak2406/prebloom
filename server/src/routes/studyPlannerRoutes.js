const express = require('express');
const router = express.Router();
const studyPlannerController = require('../controllers/studyPlannerController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, studyPlannerController.getStudyPlan);
router.post('/', verifyToken, studyPlannerController.saveStudyPlan);
router.post('/toggle-task', verifyToken, studyPlannerController.toggleTaskStatus);
router.post('/generate-combined', verifyToken, studyPlannerController.generateCombinedPlan);

module.exports = router;
