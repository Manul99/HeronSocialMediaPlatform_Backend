const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
   senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderType: { 
    type: String, 
    required: true,
    enum: ['Student', 'Teacher'] 
  },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverType: { 
    type: String, 
    required: true,
    enum: ['Student', 'Teacher'] 
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Messages = mongoose.model('Messages',MessageSchema);

module.exports = Messages;