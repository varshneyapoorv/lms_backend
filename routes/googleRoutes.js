const googleRouter = require('express').Router();
const passport = require("passport");
const {generateToken} = require("../config/jwtToken");
const User = require("../models/userModel")

const expressAsyncHandler = require("express-async-handler");


googleRouter.get("/login/success", expressAsyncHandler(async (req, res) => {
    if (req.user) {
        // Attempt to find the user in the database using their email
        const findUser = await User.findOne({ email: req.user.email });

        if(findUser){
            res.status(200).json({
                status : true,
                message : "Logged In Successfully!",
                token : generateToken(findUser?.id),
                role : findUser?.roles,
                username : findUser?.firstname + " " + findUser?.lastname,
                user_image : findUser?.user_image,
                from : "google"
            })
    } else {
            // If user is not found, return a 404 error
            res.status(404).json({
                status: false,
                message: "User not found in the database"
            });
        }
    } else {
        throw new Error ("Something went wrong")
    }
}));


googleRouter.get("/login/failed", expressAsyncHandler(async (req,res)=>{
    res.status(401).json({status : false, message : "login failed"})
}))



googleRouter.get("/google",passport.authenticate("google", ["profile", "email"]));


googleRouter.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect : "/login/success",
    failureRedirect : "/login/failed",
}));



googleRouter.get("/logout", expressAsyncHandler(async (req,res)=>{
    res.logOut();
    res.redirect("/");
}));


module.exports = googleRouter;