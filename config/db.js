const mongoose = require('mongoose');

const connectDB = async() =>{
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI); 

        if (!process.env.MONGO_URI) {
            throw new Error("MongoDB URI is missing in .env file! ");
        }
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected ${con.connection.host}}`)
    } catch (error) {
        console.log(`Error:${error}`)
        process.exit();
    }
}

module.exports = connectDB;