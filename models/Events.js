const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true }, 
    description: { type: String, maxlength: 100 },
    eventType: { type: String, required: true }, 
    rules: [{ type: String }], 
    media: [{ type: String }] 
},
    {timestamps:true}
);

const Events = mongoose.model('Events',eventSchema);

module.exports = Events;