const express = require('express');
const { getGamification } = require('../controllers/GamificationController');
const router = express.Router();

router.get('/:userId',getGamification);

module.exports = router;