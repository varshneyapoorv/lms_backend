const googleRouter = require('express').Router();
const passport = require("passport");
const {generateToken} = require("../models/userModel");

const expressAsyncHandler = require("express-async-handler");


googleRouter.get("/login/success", expressAsyncHandler(async (req,res)=>{
    console.log("success");
    res.status(200).json({
    status : true,
    message : "login success"})
 
}))


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