const asyncHandler = require('express-async-handler');
const {Storage} = require('@google-cloud/storage');
const Vlogs = require('../models/Vlog');
const storage = new Storage({keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS })

const bucket = storage.bucket('heronsocialmediaplatformfilesupload')

//Create Vlogs
const createVlogs = asyncHandler(async (req, res) => {
    try {
        const { userId, title, description } = req.body;

        if (!userId || !title || !description) {
            res.status(400);
            throw new Error('Please fill all the fields');
        }

        let mediaFilesUrl = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileName = `vlogMedia/${Date.now()}_${file.originalname}`;
                const fileRef = bucket.file(fileName);
                const stream = fileRef.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });

                stream.end(file.buffer);

                const fileUrl = await new Promise((resolve, reject) => {
                    stream.on("finish", async () => {
                        // Generate the public URL
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                        resolve(publicUrl);
                    });
                    stream.on("error", reject);
                });

                mediaFilesUrl.push(fileUrl);
            }
        }

        const vlog = new Vlogs({
            userId,
            title,
            description,
            media: mediaFilesUrl
        });

        await vlog.save();
        res.status(201).json({ message: "Vlog created successfully", vlog });
    } catch (error) {
        console.error("Error during creating vlog", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update Vlog
const updateVlog = asyncHandler(async (req, res) => {
    try {
        const { vlogId } = req.params;
        const { title, description } = req.body;

        const vlog = await Vlogs.findById(vlogId);

        if (!vlog) {
            res.status(404);
            throw new Error('Vlog not found');
        }

        vlog.title = title || vlog.title;
        vlog.description = description || vlog.description;

        if (req.files && req.files.length > 0) {
            let mediaFilesUrl = [];
            for (const file of req.files) {
                const fileName = `vlogMedia/${Date.now()}_${file.originalname}`;
                const fileRef = bucket.file(fileName);
                const stream = fileRef.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });

                stream.end(file.buffer);

                const fileUrl = await new Promise((resolve, reject) => {
                    stream.on("finish", async () => {
                        // Generate the public URL
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                        resolve(publicUrl);
                    });
                    stream.on("error", reject);
                });

                mediaFilesUrl.push(fileUrl);
            }

            vlog.media = mediaFilesUrl;
        }

        await vlog.save();
        res.status(200).json({ message: "Vlog updated successfully", vlog });
    } catch (error) {
        console.error("Error updating vlog", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//Get all vlogs

const getVlogs = asyncHandler(async(req,res) =>{
    try {
        const vlogs = await Vlogs.find().populate("userId","username");
        res.status(200).json(vlogs);
    } catch (error) {
        console.error("Error getting vlogs", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// Get by ID
const getVlogByID = asyncHandler(async(req,res) =>{
    try {
        const { vlogId } = req.params;
        const vlog = await Vlogs.findById(vlogId).populate("userId","username");

        if (!vlog) {
            res.status(404);
            throw new Error('Vlog not found');
        }

        res.status(200).json(vlog);
    } catch (error) {
        console.error("Error getting vlog by ID", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Delete by ID
const deleteVlog = asyncHandler(async(req,res) =>{
    try {
        const vlogId = req.params.id;
        const vlog = await Vlogs.findById(vlogId);

        if(!vlog){
            res.status(404);
            throw new Error('Vlog not found');
        }

        // Delete media files from Google Cloud Storage 
        if (vlog.media && vlog.media.length > 0) {
            for (const fileUrl of vlog.media) {
                const fileName = fileUrl.split("/").pop(); // Extract file name from URL
                const fileRef = bucket.file(`vlogMedia/${fileName}`);
                await fileRef.delete();
            }
        }

        // Delete the vlog from the database
        await Vlogs.deleteOne({ _id: vlogId });

        res.status(200).json({ message: "Vlog deleted successfully" });
    } catch (error) {
        console.error("Error deleting vlog", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = {createVlogs,updateVlog,getVlogs,getVlogByID,deleteVlog}