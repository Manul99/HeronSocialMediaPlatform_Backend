const asyncHandler = require('express-async-handler');
const Parents = require('../models/Parents');
const Messages = require('../models/Messageing');
const Clubs = require('../models/Clubs');

//Assign a child to a parent
const assignChild = asyncHandler(async (req,res) => {
   try {
    const{childId, level} = req.body;
    const parentId = req.user.id;

    if(!childId){
        return res.status(400).json({message:"Child Id is required"});
    }

    const restrictions = {
        canViewMessages: level >= 1,
        canApproveFriends: level >=2,
        canMonitorActivities: level === 3
    };

    const parentEntry = new Parents({
        parentId,
        childId,
        restrictions
    });

    await parentEntry.save();

    res.status(201).json({message:"Child assigned to parent", parentEntry});
   } catch (error) {
    console.error("Error during assigning :", error);
    res.status(500).json({ message: "Internal server error" });
   }
});

//Parent can track using this
const getParentOverview = asyncHandler(async (req,res) => {
   try {
    const parentId = req.user.id;
    

    const parentData = await Parents.findOne({parentId}).populate('childId');

    if(!parentData){
        return res.status(404).json({message:"No access this child"});
    }

    const childId = parentData.childId._id;

    const messages = await Messages.find({
        $or:[{senderId: childId}, {receiverId: childId}]
    }).sort({createdAt: -1});

    const clubs = await Clubs.find({members: childId});

    const overview = {
        childInfo: parentData.childId,
        restrictions: parentData.restrictions,
        messages,
        clubs
    };

    res.status(200).json(overview);
   } catch (error) {
    console.error("Error during get parent overview :", error);
    res.status(500).json({ message: "Internal server error" });
   }
});

//Update parent restrctions
const updateRestrictions = asyncHandler(async (req,res) => {
    try {
    const parentId = req.user.id;
    const {childId} = req.params;
    const {level} = req.body;

    const parentEntry = await Parents.findOne({parentId, childId});

    if(!parentEntry){
        return res.status(404).json({message:"Parent-child record not found"});
    }

    parentEntry.restrictions = {
        canViewMessages: level >= 1,
        canApproveFriends: level >=2,
        canMonitorActivities: level === 3
    };

    await parentEntry.save();

    res.status(200).json({message:"Restrictions updated", parentEntry});
    } catch (error) {
        console.error("Error during update restrictions :", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = {assignChild,getParentOverview,updateRestrictions};