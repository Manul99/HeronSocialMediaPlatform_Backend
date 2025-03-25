const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    title:{type:String, required:true},
    content:{type:String, required:true},
    image:[{type:String}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    comments:[{
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        comment:{type:String, required:true},
        createdAt:{type:Date, default:Date.now}
    }],
    createdAt:{type:Date, default:Date.now}
});

const Blogs = mongoose.model('Blogs', BlogSchema);

module.exports=Blogs;