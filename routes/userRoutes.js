const express = require('express');
const { register, login, updateUser, deleteAccount, approveTeacher, getClassOverview } = require('../controllers/UserControllers');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../middleware/auth');


const storage1 = multer.memoryStorage();
const upload1 = multer({storage:storage1});



router.post('/', upload1.single("profileImage"), register);
router.post('/login',login);
router.put('/update-user',authMiddleware,updateUser);
router.post('/delete-account',deleteAccount);
router.post('/approveteacher',authMiddleware,approveTeacher);
router.get('/class-overview',authMiddleware,getClassOverview);

module.exports = router;

