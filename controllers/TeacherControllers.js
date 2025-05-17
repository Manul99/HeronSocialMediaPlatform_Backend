const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teachers = require('../models/Teachers');

const assignStudent = asyncHandler(async (req, res) => {
   try {
    const teacherId = req.user.id;
    const {studentId} = req.body;

    const student = await User.findOne({ _id: studentId, userType: 'student' });

    if(!student) return res.status(404).json({message:"Student not found"});

    student.assignedTeacher = {teacherId,isApproved:false};
    await student.save();

    res.status(200).json({message:"Student assigned",student});
   } catch (error) {
    console.error("Error during assigning student",error);
    res.status(500).json({ message: 'Internal server error' });
   }

});

const registerTeacher = asyncHandler(async (req, res) => {
    try {
        const { fullName, username, email, password, mobile, level,gender, subject } = req.body;

        if (!fullName|| !username || !email || !password || !level, !gender, !subject) {
            return res.status(400).json({ message: "Please fill all required fields." });
        }

        const userExists = await Teachers.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
  
       
        const teacher = new Teachers({
            fullName,
            username,
            email,
            password: hashPassword,
            mobile,
            level,
            gender,
            subject
        });

        await teacher.save();
        res.status(201).json({ message: "Teacher registered successfully", teacher });
    } catch (error) {
        console.error("Error during registration", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const loginTeacher = asyncHandler(async (req, res) => {
    const {username, password} = req.body;
    const JWT_SECRECT = 'manuss' 
    try {
        const user = await Teachers.findOne({ username });

        if(!user){
            res.status(404).json({message:'User not Found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:'Invalid Password'});
        }

        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRECT, { expiresIn: '1h' });
        res.status(200).json({token,user});
    } catch (error) {
        console.log('Error during login', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

const getAllTeachers = asyncHandler(async (req, res) => {
   try {
        const users = await Teachers.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events', details: error.message });
    }
});

const getTeacherById = asyncHandler(async(req,res) =>{
    try {
     const teacherId = req.user.id;
     const user = await Teachers.findOne({ _id: teacherId });

    if(!user){
        return res.status(404).json({message:'User not found'});
    }
    res.status(200).json(user);
    } catch (error) {
        console.error('Failed to get user');
        res.status(500).json({message:'Internal server error'});
    }
});
module.exports = {assignStudent,registerTeacher,loginTeacher,getAllTeachers,getTeacherById};