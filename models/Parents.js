const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
    parentId:{type:mongoose.Schema.Types.ObjectId},
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true},
    password: { type: String }, // optional for Google
    googleId: { type: String },
     children: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // or your student model
  },
    createdAt: { type: Date, default: Date.now },
    resetOTP: { type: String }, 
    resetOTPExpiration: { type: Date },
});

const Parents = mongoose.model('Parents',ParentSchema);

module.exports = Parents;