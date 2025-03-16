const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createPosts, updatePost, getPosts, getPostById, deletePost } = require('../controllers/PostCollectionController');

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'./uploads');
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now()+ path.extname(file.originalname));
    }
})

const upload = multer({storage:storage});

router.post('/create',upload.array('media',5),createPosts);
router.put('/update/:id',upload.array('media',5),updatePost);
router.get('/getPost',getPosts);
router.get('/getPosts/:id',getPostById);
router.delete('/:id',deletePost);


module.exports = router;