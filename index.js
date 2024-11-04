const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, handleError } = require("./middlewares/errorHandler");
const userRouter = require("./routes/userRoutes");
const bodyParser = require("body-parser");

const session = require("express-session");
const passport = require('passport');
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose')
const googleRouter = require("./routes/googleRoutes");
const passportSetup = require("./utils/passport")


const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

dbConnect();
app.use(
    session({
        secret: "mysecret", // Use a strong secret for production
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 12 * 60 * 60, // Session TTL in seconds
        }),
        // cookie: {
        //     maxAge: 12 * 60 * 60 * 1000, // Set cookie max age (12 hours)
        // },
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json());
// Middleware to parse JSON request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get ("/", (req,res)=>{
    res.send(`<a href="http://localhost:4000/google">Login with google</a>`)
})


// ROUTES   
app.use("/api/user", userRouter)
app.use("/", googleRouter);


// middlewaRE
app.use(notFound);
app.use(handleError);




app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})