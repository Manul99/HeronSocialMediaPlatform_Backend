const asyncHandler = require('express-async-handler');
const User = require('../models/User');

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

module.exports = {assignStudent};