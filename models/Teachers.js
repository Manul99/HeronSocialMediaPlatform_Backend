const mongoose = require('mongoose');
const { genderList, LevelType } = require('../enums/enumList');

const TeacherSchema = new mongoose.Schema({
    // userId:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    // subjectSpecialty:{type:String, required: true},
    // classStudents:[{type: mongoose.Schema.Types.ObjectId,ref:'Student'}],
    // createdAt:{type:Date, default:Date.now},
    teacherId:{type:mongoose.Schema.Types.ObjectId},
    fullName:{type:String, required: true},
    username:{type:String,required:true},
    password:{type:String, required: true},
    gender:{type:String, enum:Object.values(genderList), required:true},
    subject:{type:String, required: true},
    level:{type:Number, enum:Object.values(LevelType)}

});

const Teachers = mongoose.model('Teachers',TeacherSchema);
module.exports = Teachers;