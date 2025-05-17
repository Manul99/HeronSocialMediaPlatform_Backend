const asyncHandler = require('express-async-handler');
const Clubs = require('../models/Clubs');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const mongoose = require('mongoose');
const Parents = require('../models/Parents');

const uploadDir = path.join(__dirname, '../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const serverBaseUrl = 'http://localhost:3001';

const createClubs = asyncHandler(async (req, res) => {
    try {
        let { clubName, description, clubType } = req.body;
        // Validate required fields
        if (!clubName || !description || !clubType) {
            res.status(400);
            throw new Error("Club name, created by, and mentor ID are required");
        }

        // Parse invitedMembers if it's sent as a JSON string
    let invitedMembers = [];
    if (req.body.invitedMembers) {
      try {
        invitedMembers = JSON.parse(req.body.invitedMembers);
        if (!Array.isArray(invitedMembers)) throw new Error();
      } catch {
        res.status(400);
        throw new Error("Invalid invitedMembers format. Must be a JSON array.");
      }
    }

    // Handle club rules (optional, might come as clubRules[] or a single string)
    let clubRules = [];
    if (req.body['clubRules[]']) {
      // If multiple rules are sent
      if (Array.isArray(req.body['clubRules[]'])) {
        clubRules = req.body['clubRules[]'];
      } else {
        clubRules = [req.body['clubRules[]']];
      }
    }
       

        let clubLogoUrl = "";
       

      // Handle clubLogo file upload
     if (req.file) {
                   const fileName = `clubLogo_${Date.now()}_${req.file.originalname}`;
                   const filePath = path.join(uploadDir, fileName);
       
                   // Save file to local storage
                   fs.writeFileSync(filePath, req.file.buffer);
       
                   // Set profile image URL for retrieval
                   clubLogoUrl = `${serverBaseUrl}/uploads/${fileName}`;
               }

    
        const invited = invitedMembers.map(id => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return { userId: id, isAccepted: false };
});


        // Create a new club document
        const club = new Clubs({
           clubName,
           description,
           clubType,
           clubRules,
           clubLogo: clubLogoUrl,
           members: invited  
        });

        // Save the club to the database
        await club.save();
        await Promise.all(invitedMembers.map(async (studentId) => {
    await User.findByIdAndUpdate(studentId, {
        $push: {
            clubInvitations: {
                clubId: club._id,
                clubName: club.clubName,
                invitedAt: new Date(),
                isAccepted: false
            }
        }
    });
}));

        res.status(201).json({ message: 'Club created successfully', club });
    } catch (error) {
        console.error("Error during creating club", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const updateClubs = asyncHandler(async (req, res) => {
    try {
        const { clubName, description, mentorId, members, isPublic, events } = req.body;
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

const getAllClubs = asyncHandler(async (req, res) => {
   try {
        const clubs = await Clubs.find();
        res.status(200).json(clubs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events', details: error.message });
    }
});

// // Get club by ID
// const getClubById = asyncHandler(async (req, res) => {
//     try {
//         const club = await Clubs.findById(req.params.id).populate("createdBy",  "mentorId");
//         if (!club) {
//             res.status(404);
//             throw new Error('Club not found');
//         }
//         res.status(200).json(club);
//     } catch (error) {
//         console.error("Error fetching club:", error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// const deleteClubs = asyncHandler(async (req, res) => {
//     try {
//         const club = await Clubs.findById(req.params.id);

//         if(!club){
//             res.status(404);
//             throw new Error('Club not found');
//         }

//         // Delete media files from Google Cloud Storage 
//         if (vlog.media && vlog.media.length > 0) {
//             for (const fileUrl of vlog.media) {
//                 const fileName = fileUrl.split("/").pop(); // Extract file name from URL
//                 const fileRef = bucket.file(`vlogMedia/${fileName}`);
//                 await fileRef.delete();
//             }
//         }

      
//                 await Vlogs.deleteOne({ _id: club });
        
//                 res.status(200).json({ message: "Club deleted successfully" });

//     } catch (error) {
//         console.error("Failed to delete club",error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

const getInvitedClubs = asyncHandler(async (req, res) => {
    const userId = req.user.id; // fixed

    const user = await User.findById(userId).populate("clubInvitations.clubId");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const invitedClubs = user.clubInvitations.filter(invite => !invite.isAccepted);
    res.status(200).json(invitedClubs);
});



const acceptClubInvitation = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Extract userId from token (set by middleware)
    const { clubId } = req.params; // Only clubId comes from the URL

    const user = await User.findById(userId);
    const club = await Clubs.findById(clubId);

    if (!user || !club) {
        return res.status(404).json({ message: "User or Club not found" });
    }

    // Update invitation as accepted
    const invitation = user.clubInvitations.find(inv => inv.clubId.toString() === clubId);
    if (invitation) {
        invitation.isAccepted = true;
    }

    // Add user to club members if not already
    if (!club.members.some(m => m.userId.toString() === userId)) {
        club.members.push({ userId, isAccepted: true });
    }

    await user.save();
    await club.save();

    res.status(200).json({ message: "Invitation accepted" });
});

const getClubsByParentChild = asyncHandler(async(req,res) =>{
   try {
     console.log("Decoded user in request:", req.user);
    const parentId = req.user.parentId;

    if (!parentId) {
        return res.status(400).json({ message: "Parent ID not found in token" });
    }
  // Step 1: Get the parent and their child userId
  const parent = await Parents.findById(parentId);
  if (!parent || !parent.children) {
    return res.status(404).json({ message: "Parent or child not found" });
  }

  // Step 2: Get the child's club invitations
  const childUser = await User.findOne(parent.children).populate("clubInvitations.clubId");
  if (!childUser) {
    return res.status(404).json({ message: "Child user not found" });
  }

  // Step 3: Filter unaccepted invitations and extract club names
  const invitedClubs = childUser.clubInvitations
    .filter(inv => !inv.isAccepted)
    .map(inv => ({
      clubName: inv.clubId?.name || "Unknown Club",
      clubId: inv.clubId?._id,
      childName: childUser.username
    }));

  res.status(200).json(invitedClubs);
   } catch (error) {
    console.error('Failed')
   }
})


module.exports = {createClubs,updateClubs,getClubs,getInvitedClubs,acceptClubInvitation,getAllClubs,getClubsByParentChild};