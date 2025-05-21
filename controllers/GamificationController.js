const asyncHandler = require('express-async-handler');
const Gamification = require('../models/Gamification');
const Parents = require('../models/Parents');
const User = require('../models/User');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const getGamification = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        const gamification = await Gamification.findOne({userId});

        if(!gamification){
            return res.status(404).json({message: 'Gamification not found'});
        }
        res.status(200).json(gamification);
    } catch (error) {
        console.error("Error fetching gamification data:",error);
        res.status(500).json({message: 'Internal server error'});
    }
});

const getGamificationForChild = asyncHandler(async (req, res) => {
    try {
      // Parent is logged in → their ID is req.user.id
       const parentId = req.user.id;


        // Find the parent by their _id
          const parent = await Parents.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        // Parent has a `children` field that stores the child userId
        const childUserId = parent.children;

        // Find gamification data using child’s userId
          const gamification = await Gamification.findOne({ userId: childUserId }).select('level points');
    if (!gamification) {
      return res.status(404).json({ message: 'Gamification not found' });
    }

    // Fetch child user info
    const childUser = await User.findById(childUserId).select('username level');
    if (!childUser) {
      return res.status(404).json({ message: 'Child user not found' });
    }

        // Return combined data
        res.status(200).json({
            gamification,
            username: childUser.username,
            level: childUser.level
        });
    } catch (error) {
        console.error("Error fetching gamification data for child:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = {getGamification,getGamificationForChild};