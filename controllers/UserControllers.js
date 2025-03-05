const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { UserType, MedalType } = require('../enums/enumList');


//User registration
const register = asyncHandler(async (req, res) => {
    try {
        const { fullName, username, email, password, mobile, userType, level, profileImage, bio, achievements, medals } = req.body;

        // Validate all required fields
        if (!fullName || !username || !email || !password || !mobile || !userType || !level ) {
            res.status(400);
            throw new Error("Please fill all the required fields.");
        }

        // Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            throw new Error("User already exists");
        }

         // Validate userType and medals against enums
         if (!Object.values(UserType).includes(userType)) {
            res.status(400);
            throw new Error("Invalid userType. Valid types are: student, teacher, parent.");
        }

        if (!Object.values(MedalType).includes(medals)) {
            res.status(400);
            throw new Error("Invalid medals type. Valid types are: Bronze, Silver, Gold, Platinum, Diamond.");
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            fullName,
            username,
            email,
            password: hashPassword,
            mobile,
            userType,
            level,
            profileImage,
            bio,
            achievements: achievements || [], 
            medals: medals, 
            points: 0,
        });

        // Save user to database
        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.log('Error during register', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = {register};