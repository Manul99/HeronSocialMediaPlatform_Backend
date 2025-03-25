const express = require('express');
const { register, login, updateUser, deleteAccount } = require('../controllers/UserControllers');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const storage1 = multer.memoryStorage();
const upload1 = multer({storage:storage1});



router.post('/', upload1.single("profileImage"), register);
router.post('/login',login);
router.put('/:userId',updateUser);
router.post('/delete-account',deleteAccount);

module.exports = router;

