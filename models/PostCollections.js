const mongoose = require('mongoose');
const { PostType } = require('../enums/enumList');

const postSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    content:{type:String,required:true},
    media:[{type:String}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    comments:[{
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        text: String,
        createdAt:{type:Date, default:Date.now},
    }],
    category:{type:String,enum:Object.values(PostType),required:true},
    createdAt:{type:Date, default:Date.now},
})

const PostCollections = mongoose.model('PostCollections',postSchema);

module.exports = PostCollections;