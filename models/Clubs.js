const mongoose = require('mongoose');


const ClubSchema = new mongoose.Schema({
    clubName:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    clubLogo:{type:String},
    coverImage:{type:String},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    mentorId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    members:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    isPublic:{type:Boolean,default:true},
    events:[{type:mongoose.Schema.Types.ObjectId,ref:'Events'}],
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now},
});

const Clubs = mongoose.model('Clubs',ClubSchema);

module.exports = Clubs;