const mongoose = require('mongoose');
const { UserType, LevelType, MedalType } = require('../enums/enumList');

const userSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId},
    fullName:{type:String,required:true},
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    mobile:{type:String,required:true},
    userType:{type:String,enum:Object.values(UserType),required:true},
    profileImage:{type:String},
    level:{type:Number, enum:Object.values(LevelType)},
    bio:{type:String},
    achievements:[{type:String}],
    medals:{type:String,enum:Object.values(MedalType)},
    parentIds:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    studentIds:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    points:{type:Number, default:0},
    createdAt:{type:Date, default:Date.now},
    updateAt:{type:Date, default:Date.now},
    resetOTP: { type: String }, 
    resetOTPExpiration: { type: Date },
    assignedTeacher: {
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isApproved: { type: Boolean, default: false }
      },
    academicProgress:[{
        grades:[{subject: String, score:Number}],
        attendance:Number
    }],

})

const User = mongoose.model('User',userSchema);
module.exports = User;