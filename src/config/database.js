const mongoose = require('mongoose');

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to db!");
    } catch (error) {
        console.error("Error connecting to db:", error);

    }
}

module.exports = connectDB;