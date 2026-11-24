const express = require('express');
const router = express.Router();
const pyqController = require('../controllers/pyqController');

router.get('/', pyqController.getPYQPapers);
router.get('/:id', pyqController.getPYQById);

module.exports = router;
