const express = require('express');
const router = express.Router();
const currentAffairsController = require('../controllers/currentAffairsController');

router.get('/categories', currentAffairsController.getCategories);
router.get('/', currentAffairsController.getCurrentAffairs);
router.get('/:id', currentAffairsController.getCurrentAffairById);

module.exports = router;
