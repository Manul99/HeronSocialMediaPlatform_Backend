const asyncHandler = require('express-async-handler')
const path = require('path');
const fs = require('fs');
const Blogs = require('../models/Blogs');

const uploadDir = path.join(__dirname, '../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const serverBaseUrl = 'http://localhost:3001';

const createBlog = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const {title,content,image} = req.body;

        if(!title || !content){
            res.status(400);
            throw new Error("title and content are required");
        }


         let blogMediaFilesUrl = [];
          
                  if (req.files && req.files.length > 0) {
                      for (const file of req.files) {
                        const fileName = `blogCollectionMedia_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
                          const filePath = path.join(uploadDir, fileName);
          
                          // Write file to local storage
                          fs.writeFileSync(filePath, file.buffer);
          
                          // Save full URL path
                          blogMediaFilesUrl.push(`${serverBaseUrl}/uploads/${fileName}`);
                      }
                  }
        
        const blog = new Blogs({
            userId,
            title,
            content,
            image: blogMediaFilesUrl
        });

        await blog.save();
        res.status(201).json({message:'Blog created successfully', blog})

    } catch (error) {
        console.error('Failed to create blog:',error);
        res.status(500).json({message:'Internal server error', error: error.message})
    }

});

const updateBlogs = asyncHandler(async(req,res) =>{
    try {
        const { title, content, image } = req.body;
        const { blogId } = req.params;

        const blog = await Blogs.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (title) blog.title = title;
        if (content) blog.content = content;

        let blogMediaFilesUrl = [];
          
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
              const fileName = `blogCollectionMedia_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
                const filePath = path.join(uploadDir, fileName);

                // Write file to local storage
                fs.writeFileSync(filePath, file.buffer);

                // Save full URL path
                blogMediaFilesUrl.push(`${serverBaseUrl}/uploads/${fileName}`);
            }
        }

        blog.image = blogMediaFilesUrl;

        await blog.save();
        res.status(200).json({ message: "Blog updated successfully", blog });



    } catch (error) {
        console.error('Failed to update blogs', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

const likeandUnlike = asyncHandler(async (req, res) => {
    try {

        const blog = await Blogs.findById(req.params.id);
        if (!blog) return res.status(400).json({ message: 'Blog not found' });

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('User ID:', userId);

        if (blog.likes.includes(userId)) {
            blog.likes = blog.likes.filter(id => id.toString() !== userId);
        } else {
            blog.likes.push(userId);
        }

        await blog.save();
        res.status(200).json({ likes: blog.likes.length });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

const addComments = asyncHandler(async (req, res) => {
    try {
        const blog = await Blogs.findById(req.params.id);
        if (!blog) return res.status(400).json({ message: 'Blog not found' });

        const { comment } = req.body;
        if (!comment || comment.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        blog.comments.push({ userId: req.user.id, comment });
        await blog.save();


        res.status(200).json({ message: 'Comment added successfully', blog });

    } catch (error) {
        console.error('Failed to add comment:', error);
        res.status(500).json({ message: error.message });
    }
})


module.exports = {createBlog,updateBlogs,likeandUnlike,addComments}