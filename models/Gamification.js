const mongoose = require('mongoose');
const { MedalType } = require('../enums/enumList');

const gamificationSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    level:{type:String,enum:Object.values(MedalType),required:true, default:MedalType.BRONZE},
    points:{type:Number,default:0},
    achievements:[{type:String}],
    createdAt:{type:Date, default:Date.now},
});

const Gamification = mongoose.model('Gamification',gamificationSchema);

module.exports = Gamification;