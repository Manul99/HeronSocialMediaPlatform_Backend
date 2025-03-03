const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
require('dotenv').config();
const userRoutes = require('./routes/userRoutes')

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users',cors(),userRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));

