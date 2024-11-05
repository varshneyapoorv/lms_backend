const passport = require("passport");
const crypto = require("crypto")

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
    async function (accessToken, refreshToken, profile, cb) {
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        console.log('Profile:', profile);
    
        try {
            let data = profile?._json;
            const user = await User.findOne({ email: data.email });
    
            if (user) {
                return cb(null, user);
            } else {
                const randomPassword = crypto.randomBytes(16).toString('hex');  // Generate a random password
                const newUser = await User.create({
                    googleId: profile.id,
                    firstname: data.given_name,
                    lastname: data.family_name,
                    user_image: data.picture,
                    email: data.email,
                    roles: 'user',
                    password: randomPassword,  // Assign the random password
                });
    
                return cb(null, newUser);
            }
        } catch (error) {
            console.error('Error during Google OAuth strategy:', error);
            return cb(error, null);
        }
    }
    
    
));


passport.serializeUser((user, done) => {
    done(null, user)
});


passport.deserializeUser((user, done) => {
    done(null, user)
})
