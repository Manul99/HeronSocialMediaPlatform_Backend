const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createBlog, updateBlogs, likeandUnlike, addComments } = require('../controllers/BlogsController');
const {authMiddleware} = require('../middleware/auth')

const storage1 = multer.memoryStorage();
const upload1 = multer({storage:storage1});

router.post('/', upload1.array('image', 5), authMiddleware,createBlog);
router.put('/:blogId', upload1.array('image',5),updateBlogs);
router.post('/:id/like',authMiddleware,likeandUnlike);
router.post('/:id/comments',authMiddleware,addComments);


module.exports = router;