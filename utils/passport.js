const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
require("dotenv").config();


passport.use(new GoogleStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback",
        scope: ["profile", "email"],

    },
    // async function (profile, done) {
    //     console.log(profile);
    //     return done(null,user);
    // }
    function (accesToken, refreshToken, profile, cb) {
        console.log(profile)
        return cb(null, profile);
    }
));


passport.serializeUser((user, done) => {
    done(null, user)
});


passport.deserializeUser((user, done) => {
    done(null, user)
})
