const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { assignStudent, registerTeacher, loginTeacher, getAllTeachers, getTeacherById } = require('../controllers/TeacherControllers');
const router = express.Router();

router.post('/assignStudent',authMiddleware, assignStudent);
router.post('/',registerTeacher);
router.post('/login',loginTeacher);
router.get('/getteachers',getAllTeachers);
router.get('/getteacherById',authMiddleware,getTeacherById)
module.exports = router;