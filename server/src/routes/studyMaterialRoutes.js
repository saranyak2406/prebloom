const express = require('express');
const router = express.Router();
const studyMaterialController = require('../controllers/studyMaterialController');
const { verifyToken, optionalAuth } = require('../middleware/auth');

router.get('/subjects', studyMaterialController.getSubjects);
router.get('/subjects/:slug', optionalAuth, studyMaterialController.getSubjectDetail);
router.get('/lessons/:id', optionalAuth, studyMaterialController.getLessonById);
router.post('/lessons/progress', verifyToken, studyMaterialController.markLessonProgress);
router.get('/', studyMaterialController.getMaterials);
router.post('/:id/download', studyMaterialController.incrementDownload);

module.exports = router;

