const asyncHandler = require('express-async-handler');
const PostCollections = require('../models/PostCollections');
const Gamification = require('../models/Gamification');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const serverBaseUrl = 'http://localhost:3001';

//Create a new post
const createPosts = asyncHandler(async(req, res) =>{
    try {
        const userId = req.user.id;
        const { content, media, category } = req.body;

        if(!userId || !content || !category){
            res.status(400);
            throw new Error("User ID, content, and category are required");
        }

        let postMediaFilesUrl = [];
  
          if (req.files && req.files.length > 0) {
              for (const file of req.files) {
                  const fileName = `postCollectionMedia_${Date.now()}_${file.originalname}`;
                  const filePath = path.join(uploadDir, fileName);
  
                  // Write file to local storage
                  fs.writeFileSync(filePath, file.buffer);
  
                  // Save full URL path
                  postMediaFilesUrl.push(`${serverBaseUrl}/uploads/${fileName}`);
              }
          }

        const posts = new PostCollections({
            userId,
            content,
            media: postMediaFilesUrl,
            category
        });

        await posts.save();

        if(category == 1){
            await updateGamification(userId);
        }

        res.status(201).json({message:"Post created successfully",posts});
    } catch (error) {
        console.error("Error creating post:",error);
        res.status(500).json({message:"Internal server error"});
    }
});



//Update gamification points
const updateGamification = asyncHandler(async(userId) =>{
    let gamification = await Gamification.findOne({userId});

    if(!gamification){
        gamification = new Gamification({userId, points: 0});
    }

    gamification.points += 10;
    gamification.level = getMedallionLevel(gamification.points);

    await gamification.save();
})

//Get Medal level
const getMedallionLevel = (points) => {
    if(points >= 500) return "Diamond";
    if(points >= 300) return "Platinum";
    if(points >= 200) return "Gold";
    if(points >= 100) return "Silver";
    return "Bronze";
}

// Update post
const updatePost = asyncHandler(async (req, res) => {
    try {
        const { content, category } = req.body;
        const post = await PostCollections.findById(req.params.id);

        if (!post) {
            res.status(404);
            throw new Error("Post not found");
        }

        post.content = content || post.content;
        post.category = category || post.category;

        if (req.files && req.files.length > 0) {
            let updatedMediaFilesUrl = [...post.media];
            for (const file of req.files) {
                const fileName = `postCollectionMedia/${Date.now()}_${file.originalname}`;
                const fileRef = bucket.file(fileName);
                const stream = fileRef.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });

                stream.end(file.buffer);

                const fileUrl = await new Promise((resolve, reject) => {
                    stream.on("finish", async () => {
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                        resolve(publicUrl);
                    });
                    stream.on("error", reject);
                });

                updatedMediaFilesUrl.push(fileUrl);
            }
            post.media = updatedMediaFilesUrl;
        }

        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all posts
const getPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await PostCollections.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get a single post by ID
const getPostById = asyncHandler(async (req, res) => {
    try {
        const post = await PostCollections.findById(req.params.id);
        if (!post) {
            res.status(404);
            throw new Error("Post not found");
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Delete post
const deletePost = asyncHandler(async (req, res) => {
    try {
        const post = await PostCollections.findById(req.params.id);
        if (!post) {
            res.status(404);
            throw new Error("Post not found");
        }

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = {createPosts,updatePost,getPosts,getPostById,deletePost}