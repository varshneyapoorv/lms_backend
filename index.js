const express = require("express");
const dbConnect = require("./config/dbConnect");

const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

dbConnect();

app.get ("/", (req,res)=>{
    res.send("Hello from this JobPortal Server")
})
app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})