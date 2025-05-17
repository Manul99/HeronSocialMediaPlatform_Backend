const express = require('express');
const { getGamification, getGamificationForChild } = require('../controllers/GamificationController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/',authMiddleware,getGamification);
router.get('/child/gamification', authMiddleware,getGamificationForChild);

module.exports = router;