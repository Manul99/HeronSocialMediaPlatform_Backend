const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const vlogRoutes = require('./routes/vlogRoutes')
const postCollectionsRoutes = require('./routes/postCollectionRoutes')
const gamificationRoutes = require('./routes/gamificationRoutes')
const clubsRoutes = require('./routes/clubsRoutes')
const eventsRoutes = require('./routes/eventRoutes')
const blogsRoutes = require('./routes/blogRoutes');
const messageRoutes = require('./routes/messageRoutes')
const parentRoutes = require('./routes/parentRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const { initializeSocket } = require('./middleware/webSocketMiddleware');
const app = express();
const http = require("http");

connectDB();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());



app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // allow cookies or authentication headers
}));
app.use(express.json());
app.use(express.text());
app.use('/uploads', express.static('uploads'));
const server = http.createServer(app);
const io = initializeSocket(server);


app.use('/api/users',cors(),userRoutes);
app.use('/api/auth',cors(),authRoutes);
app.use('/api/vlogs',cors(),vlogRoutes);
app.use('/api/postCollections',cors(),postCollectionsRoutes);
app.use('/api/gamification',cors(),gamificationRoutes);
app.use('/api/clubs',cors(),clubsRoutes);
app.use('/api/events',cors(),eventsRoutes);
app.use('/api/blogs',cors(),blogsRoutes);
app.use('/api/messages',cors(),messageRoutes);
app.use('/api/parent',cors(),parentRoutes);
app.use('/api/teacher',cors(),teacherRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0',() => console.log(`Server is running on port ${PORT}...`));

