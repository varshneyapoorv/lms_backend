const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
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
        required: true,
        unique: true,
        index: true,
        match: [/^\d{10}$/, "Please enter a valid mobile number."]
    },
    password : {
        type : String,
        required : true,
    },
    roles : {
        type : String,
        default : "user",
    },
    profession : {
        type : String,
        required : true,
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
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// for password check
userSchema.methods.isPasswordMatched = async function (enterpassword) {
    return await bcrypt.compare(enterpassword,this.password)

}

// Create the model
const User = mongoose.model("User", userSchema);

module.exports = User;
