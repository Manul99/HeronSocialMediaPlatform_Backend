const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));

