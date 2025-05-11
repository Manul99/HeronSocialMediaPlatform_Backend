const mongoose = require('mongoose');


const ClubSchema = new mongoose.Schema({
    clubName: { type: String, required: true, trim: true },          // "Add Club Name"
    description: { type: String, required: true, trim: true },       // "Add Club Details"
    clubType: { type: String, trim: true },                          // "Add Club Type"                       // "Add Event Type"
    clubRules: [{ type: String }],                                   // "Add Club Rules"
    clubLogo: [{ type: String }],            
    members: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            isAccepted: { type: Boolean, default: false }
        }
    ],
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now},
});

const Clubs = mongoose.model('Clubs',ClubSchema);

module.exports = Clubs;