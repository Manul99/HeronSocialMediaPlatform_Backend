const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
require('dotenv').config();
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const vlogRoutes = require('./routes/vlogRoutes')
const postCollectionsRoutes = require('./routes/postCollectionRoutes')
const gamificationRoutes = require('./routes/gamificationRoutes')

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users',cors(),userRoutes);
app.use('/api/auth',cors(),authRoutes);
app.use('/api/vlogs',cors(),vlogRoutes);
app.use('/api/postCollections',cors(),postCollectionsRoutes);
app.use('/api/gamification',cors(),gamificationRoutes)

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));

