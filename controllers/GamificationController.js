const asyncHandler = require('express-async-handler');
const Gamification = require('../models/Gamification');


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

module.exports = {getGamification};