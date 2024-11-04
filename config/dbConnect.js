const mongoose = require("mongoose");
require("dotenv").config();

// application.use(dotenv).


const dbConnect = ()=>{
    try {
        console.log(process.env.MONGODB_URI)
        const connection =   mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected successfully", );
    } catch (error) {
        console.error(error);
        
    }
};


module.exports = dbConnect;