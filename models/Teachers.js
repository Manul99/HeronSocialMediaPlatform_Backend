const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    subjectSpecialty:{type:String, required: true},
    classStudents:[{type: mongoose.Schema.Types.ObjectId,ref:'Student'}],
    createdAt:{type:Date, default:Date.now},
});

const Teachers = mongoose.model('Teachers',TeacherSchema);
module.exports = Teachers;