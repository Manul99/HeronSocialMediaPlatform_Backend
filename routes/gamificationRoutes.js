const express = require('express');
const { getGamification } = require('../controllers/GamificationController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/',authMiddleware,getGamification);

module.exports = router;