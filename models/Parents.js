const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
    parentId:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    childId:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    restrictions:{
        canViewMessages:{type:Boolean, default:false},
        canApproveFriends:{type:Boolean, default:false},
        canMonitorActivities:{type:Boolean,default:false}
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Parents = mongoose.model('Parents',ParentSchema);

module.exports = Parents;