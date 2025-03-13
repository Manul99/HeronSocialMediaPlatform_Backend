const mongoose = require('mongoose');

const VlogSchema = new mongoose.Schema({

    userId:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    title:{type:String, required: true},
    description:{type:String, maxlength:100},
    media: [String],
    createdAt:{type:Date, default:Date.now},
})

const Vlogs = mongoose.model('Vlogs',VlogSchema);

module.exports = Vlogs;