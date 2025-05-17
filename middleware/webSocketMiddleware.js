const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Messages = require('../models/Messageing');

let io;

const activeUsers = {}; // Store active users

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Apply authentication middleware
    io.use(socketAuth);

    io.on("connection", (socket) => {
        const userId = socket.user.id; 
        activeUsers[userId] = socket.id; 

        console.log(`User Connected: ${userId}`);

        // Join a chat room
        socket.on("joinChat", (chatId) => {
            socket.join(chatId);
            console.log(`User ${userId} Joined Chat: ${chatId}`);
        });

        // Handle sending messages
      // Update sendMessage handler
socket.on("sendMessage", async (message) => {
  try {
    const newMessage = await Messages.create({
      senderId: userId,
      receiverId: message.receiverId,
      text: message.text,
      role: socket.user.role // 'student' or 'teacher'
    });

    const receiverSocketId = activeUsers[message.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }
    
    // Emit to sender for local update
    socket.emit('newMessage', newMessage);
    
  } catch (error) {
    socket.emit("error", { message: "Failed to send message" });
  }
});

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log(`User ${userId} Disconnected`);
            delete activeUsers[userId]; 
        });
    });

    return io;
};

//Middleware to attach io instance to request
const attachSocket = (req,res,next) =>{
    if(!io){
        return res.status(500).json({message:"Socket.io not initialized"});
    }
    req.io = io;
    next();
};


const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Attach user to socket
        next();
    } catch (error) {
        next(new Error("Authentication error: Invalid token"));
    }
};

module.exports = {initializeSocket,attachSocket,socketAuth};