const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto")
const JWT = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        // Only required for Google OAuth users
        required: function () {
          return !this.password; // googleId required only if no password (Google user)
        },
      },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    user_image: {
        type: String,
        default: "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        match: [/.+@.+\..+/, "Please enter a valid email address."]
    },
    mobile: {
        type: String,
        // Mobile required only for non-Google users
        required: function () {
          return !this.googleId; // mobile required only if googleId is absent (regular user)
        },
        unique: true,
        index: true,
        match: [/^\d{10}$/, "Please enter a valid mobile number."],
        default: null,
      },
      password: {
        type: String,
        // Password required only for non-Google users
        // required: function () {
        //   return !this.googleId; // password required only if googleId is absent (regular user)
        // },
        required : true
      },
    roles : {
        type : String,
        default : "user",
    },
     profession: {
      type: String,
      // Profession required only for non-Google users
      required: function () {
        return !this.googleId; // profession required only if googleId is absent (regular user)
      },
    },
    isBlocked : {
        type : Boolean,
        default : false,
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date,
    stripe_account_id : String,
    stripe_seller : {},
    stripeSession : {},
},
{
    timestamps : true,
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// for password check
userSchema.methods.isPasswordMatched = async function (enterpassword) {
    return await bcrypt.compare(enterpassword,this.password)

};


// jwt token
userSchema.methods.generateToken = function(){
    return JWT.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '6d'})
}

userSchema.methods.createPasswordResetToken = async function (){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;  //10 minutes

    return resetToken;
}

// Create the model
const User = mongoose.model("User", userSchema);

module.exports = User;
