const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventId:{type: mongoose.Schema.Types.ObjectId},
    clubId:{type: mongoose.Schema.Types.ObjectId,ref:'Clubs', required:true},
    name:{type:String, required: true},
    description:{type:String, maxlength:100},
    date:{type:Date, required: true},
    time:{type:String, required: true},
    location:{type:String, required: true},
    responsibleUserId:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    participants:[{type: mongoose.Schema.Types.ObjectId,ref:'User'}],
    isPublic:{type:Boolean, default:false},
    eligibilityCriteria:{
        age:{type:Number, required: false},
        school:{type:String, required: false},
        area:{type:String, required: false},
    },
    discussions:[{
        userId:{type: mongoose.Schema.Types.ObjectId,ref:'User'},
        message:{type:String, required: true},
        timestamp:{type:Date, default:Date.now}
    }],
    annoucements:[{
        title:{type:String, required: true},
        message:{type:String, required: true},
        timestamp:{type:Date, default:Date.now}
    }],

    createdAt:{type:Date, default:Date.now},
},
    {timestamps:true}
);

const Events = mongoose.model('Events',eventSchema);

module.exports = Events;