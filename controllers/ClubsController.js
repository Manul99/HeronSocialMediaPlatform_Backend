const asyncHandler = require('express-async-handler');
const Clubs = require('../models/Clubs');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS })
const bucket = storage.bucket('heronsocialmediaplatformfilesupload')

const createClubs = asyncHandler(async (req, res) => {
    try {
        const { clubName, description, createdBy, mentorId, isPublic } = req.body;

        // Validate required fields
        if (!clubName || !createdBy || !mentorId) {
            res.status(400);
            throw new Error("Club name, created by, and mentor ID are required");
        }

        // Get members and events from request body
        const members = Array.isArray(req.body.members) ? req.body.members : [];
        const events = Array.isArray(req.body.events) ? req.body.events : [];

        let clubLogoUrl = "";
        let coverImageUrl = "";

      // Handle clubLogo file upload
      if (req.files && req.files.clubLogo) {
        const clubLogoFile = req.files.clubLogo[0];
        const fileName = `clubLogo/${Date.now()}_${clubLogoFile.originalname}`;
        const file = bucket.file(fileName);
        const stream = file.createWriteStream({
            metadata: { contentType: clubLogoFile.mimetype },
        });

        stream.end(clubLogoFile.buffer);

        await new Promise((resolve, reject) => {
            stream.on("finish", async () => {
                clubLogoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                resolve();
            });
            stream.on("error", reject);
        });
    }

    // Handle coverImage file upload
    if (req.files && req.files.coverImage) {
        const coverImageFile = req.files.coverImage[0];
        const fileName = `clubCover/${Date.now()}_${coverImageFile.originalname}`;
        const file = bucket.file(fileName);
        const stream = file.createWriteStream({
            metadata: { contentType: coverImageFile.mimetype },
        });

        stream.end(coverImageFile.buffer);

        await new Promise((resolve, reject) => {
            stream.on("finish", async () => {
                coverImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                resolve();
            });
            stream.on("error", reject);
        });
    }

        // Create a new club document
        const club = new Clubs({
            clubName,
            description,
            clubLogo: clubLogoUrl,
            coverImage: coverImageUrl,
            createdBy,
            mentorId,
            members,
            isPublic,
            events,
        });

        // Save the club to the database
        await club.save();
        res.status(201).json({ message: 'Club created successfully', club });
    } catch (error) {
        console.error("Error during creating club", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const updateClubs = asyncHandler(async (req, res) => {
    try {
        const { clubName, description, createdBy, mentorId, members, isPublic, events } = req.body;
        const club = await Clubs.findById(req.params.id);

        if (!club) {
            res.status(404);
            throw new Error("Club not found");
        }

        let clubLogoUrl = club.clubLogo;
        let coverImageUrl = club.coverImage;

        // Handle clubLogo file upload
        if (req.files && req.files.clubLogo) {
            const clubLogoFile = req.files.clubLogo[0];
            const fileName = `clubLogo/${Date.now()}_${clubLogoFile.originalname}`;
            const file = bucket.file(fileName);
            const stream = file.createWriteStream({ metadata: { contentType: clubLogoFile.mimetype } });

            stream.end(clubLogoFile.buffer);

            await new Promise((resolve, reject) => {
                stream.on("finish", async () => {
                    clubLogoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                    resolve();
                });
                stream.on("error", reject);
            });
        }

        // Handle coverImage file upload
        if (req.files && req.files.coverImage) {
            const coverImageFile = req.files.coverImage[0];
            const fileName = `clubCover/${Date.now()}_${coverImageFile.originalname}`;
            const file = bucket.file(fileName);
            const stream = file.createWriteStream({ metadata: { contentType: coverImageFile.mimetype } });

            stream.end(coverImageFile.buffer);

            await new Promise((resolve, reject) => {
                stream.on("finish", async () => {
                    coverImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                    resolve();
                });
                stream.on("error", reject);
            });
        }

        // Update the club's fields
        club.clubName = clubName || club.clubName;
        club.description = description || club.description;
        club.mentorId = mentorId || club.mentorId;
        club.members = members || club.members;
        club.isPublic = isPublic !== undefined ? isPublic : club.isPublic;
        club.events = events || club.events;
        club.clubLogo = clubLogoUrl;
        club.coverImage = coverImageUrl;

        await club.save();
        res.status(200).json({ message: 'Club updated successfully', club });
    } catch (error) {
        console.error("Error during updating club", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all clubs
const getClubs = asyncHandler(async (req, res) => {
    try {
        const clubs = await Clubs.find().populate("createdBy",  "mentorId");
        res.status(200).json(clubs);
    } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get club by ID
const getClubById = asyncHandler(async (req, res) => {
    try {
        const club = await Clubs.findById(req.params.id).populate("createdBy",  "mentorId");
        if (!club) {
            res.status(404);
            throw new Error('Club not found');
        }
        res.status(200).json(club);
    } catch (error) {
        console.error("Error fetching club:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {createClubs,updateClubs,getClubs,getClubById};