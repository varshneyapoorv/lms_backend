const mongoose = require("mongoose");

const dbConnect = ()=>{
    try {
        const connection =   mongoose.connect("mongodb://localhost:27017/lms")
        console.log("MongoDB connected successfully", );
    } catch (error) {
        console.error(error);
        
    }
};


module.exports = dbConnect;