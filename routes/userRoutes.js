const express = require('express');
const { register, login, updateUser, deleteAccount } = require('../controllers/UserControllers');
const router = express.Router();
const multer = require('multer');
const path = require('path');

 const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'./uploads');
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now()+ path.extname(file.originalname));
    }
})

const upload = multer({storage:storage});


router.post('/', upload.single("profileImage"), register);
router.post('/login',login);
router.put('/:userId',updateUser);
router.post('/delete-account',deleteAccount);

module.exports = router;

