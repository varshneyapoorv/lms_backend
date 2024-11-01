const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, handleError } = require("./middlewares/errorHandler");
const userRouter = require("./routes/userRoutes");
const bodyParser = require("body-parser");

const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get ("/", (req,res)=>{
    res.send("Hello from this JobPortal Server")
})


// ROUTES   
app.use("/api/user", userRouter)


// middlewaRE
app.use(notFound);
app.use(handleError);




app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})