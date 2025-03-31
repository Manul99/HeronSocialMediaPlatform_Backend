const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

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
        socket.on("sendMessage", (message) => {
            const chatRoom = message.receiverId || message.clubId;
            
            if (!message.text) {
                return socket.emit("error", { message: "Message cannot be empty" });
            }

            const newMessage = {
                senderId: userId,
                receiverId: message.receiverId || null,
                clubId: message.clubId || null,
                text: message.text,
                media: message.media || [],
                createdAt: new Date()
            };

            io.to(chatRoom).emit("message", newMessage);
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