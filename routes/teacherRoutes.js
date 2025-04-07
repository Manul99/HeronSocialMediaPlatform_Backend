const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { assignStudent } = require('../controllers/TeacherControllers');
const router = express.Router();

router.post('/assignStudent',authMiddleware, assignStudent);

module.exports = router;