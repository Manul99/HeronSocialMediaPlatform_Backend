const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createPosts, updatePost, getPosts, getPostById, deletePost, likeandUnlike, addComments } = require('../controllers/PostCollectionController');
const { authMiddleware } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'./uploads');
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now()+ path.extname(file.originalname));
    }
})

const upload = multer({storage:storage});
const storage1 = multer.memoryStorage();
const upload1 = multer({storage:storage1});

router.post('/create',upload1.array('media',5),authMiddleware,createPosts);
router.put('/update/:id',upload.array('media',5),updatePost);
router.get('/getPost',getPosts);
router.get('/getPosts/:id',getPostById);
router.delete('/:id',deletePost);
router.post('/:id/like',authMiddleware,likeandUnlike);
router.post('/:id/comments',authMiddleware,addComments);


module.exports = router;