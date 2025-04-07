const asyncHandler = require('express-async-handler');
const Messages = require('../models/Messageing');
const path = require('path');
const fs = require('fs');

//Send a direct or group message
const sendMessage = asyncHandler(async (req, res) => {
    try {
        const senderId = req.user.id; 
        const { receiverId, message, clubId, media } = req.body;
       

        if(!message){
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        let mediaFilesUrl = [];
        
                if (req.files && req.files.length > 0) {
                    for (const file of req.files) {
                        const fileName = `msgMedia_${Date.now()}_${file.originalname}`;
                        const filePath = path.join(uploadDir, fileName);
        
                        // Write file to local storage
                        fs.writeFileSync(filePath, file.buffer);
        
                        // Save full URL path
                        mediaFilesUrl.push(`${serverBaseUrl}/uploads/${fileName}`);
                    }
                }
    
        const newMessage = await Messages({
            senderId,
            receiverId,
            clubId,
            message,
            media:mediaFilesUrl,
            createdAt: new Date()
        });
    
        await newMessage.save();
    
        req.io.to(receiverId || clubId).emit('newMessage', newMessage);
    
        res.status(201).json({message:"Message sent",newMessage});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
  
});

//Get all messages
const getMessages = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { chatType, chatId } = req.params;

    let messages;

    if(chatType === 'direct'){
        messages = await Messages.find({
            $or:[{senderId: userId, receiverId: chatId}, {senderId: chatId, receiverId: userId}]
        }).sort({createdAt: 1});

    }
    else if(chatType === 'group'){
        messages = await Messages.find({clubId: chatId}).sort({createdAt: 1});
    }
    else{
        return res.status(400).json({message:"Invalid chat type"});
    }

    res.status(200).json(messages);
});

module.exports = {sendMessage,getMessages};