const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    receiverId:{type: mongoose.Schema.Types.ObjectId,ref:'User', default:null},
    clubId:{type: mongoose.Schema.Types.ObjectId,ref:'Club', default:null},
    message:{type:String, required: true},
    media:[{type:String}],
    createdAt:{type:Date, default:Date.now},
});

const Messages = mongoose.model('Messages',MessageSchema);

module.exports = Messages;