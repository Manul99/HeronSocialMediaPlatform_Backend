const asyncHandler = require('express-async-handler');
const Messages = require('../models/Messageing');
const path = require('path');
const fs = require('fs');

//Send a direct or group message
// Send a direct message
const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, receiverType, text, senderType } = req.body;

    const newMessage = await Messages.create({
        senderId: req.user.id,
        senderType,
        receiverId,
        receiverType,
        text,
    });

    // Emit socket.io message
    req.io?.to(receiverId).emit('newMessage', newMessage);

    res.status(201).json(newMessage);
});

// Get all messages between logged-in user and another user
const getMessages = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { chatId } = req.params;

    const messages = await Messages.find({
        $or: [
            { senderId: userId, receiverId: chatId },
            { senderId: chatId, receiverId: userId }
        ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
});


module.exports = {sendMessage,getMessages};