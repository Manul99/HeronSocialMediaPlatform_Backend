const mongoose = require('mongoose');
const { LevelType, genderList } = require('../enums/enumList');

const userSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId},
    fullName:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String,required:true},
    mobile:{type:String,required:true},
    gender:{type:String, enum:Object.values(genderList), required:true},
    level:{type:Number, enum:Object.values(LevelType)},
    subject:{type:String},
    clubInvitations: [{
        clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Clubs" },
        clubName: { type: String },
        invitedAt: { type: Date, default: Date.now },
        isAccepted: { type: Boolean, default: false }
    }],
  

})

const User = mongoose.model('User',userSchema);
module.exports = User;