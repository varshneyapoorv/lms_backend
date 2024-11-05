const { generateToken } = require("../config/jwtToken");
const JWT = require("jsonwebtoken")

const validateMongodbId = require("../config/validateMongoDbId");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const sendEmail = require("./emailCtrl");

// create a user

const registerAUser = asyncHandler(async (req, res) => {
    // Get the email from the req.body and find whether a user with this email exists or not
    try {
        const email = req.body.email;
        // Find the user with this email
        const findUser = await User.findOne({ email });

        if (!findUser) {
            // Create the user
            const createUser = await User.create(req.body);
            return res.status(201).json({
                status: true,
                message: "User Created Successfully",
                createUser,
            });
        } else {
            // Respond with an error if the user already exists
            return res.status(409).json({
                status: false,
                message: "User Already Exists!",
            });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});


// login a user
const loginUser = asyncHandler( async(req,res)=>{
    try{
        const {email,password}= req.body
        // validation
        if(!email || !password){
            return res.status(500).send({
                success:"false",
                message:"please add email or password"
            })
        }
        // check user
        const user = await User.findOne({email})
        // user validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'user not found'
            })
        }
        // check pass
        const isMatch = await user.isPasswordMatched(password)

        // validation pass
        if(!isMatch){
            return res.status(401).send({
                success:false,
                message:"invalid credentials"
            })
        }
        // token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200)
        .cookie("token", token,{    
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),  
            secure: process.env.NODE_ENV !== "development",
                // httpOnly: process.env.NODE_ENV !== "development",
                httpOnly: true, // Makes the cookie inaccessible to JavaScript
                sameSite: process.env.NODE_ENV !== "development",
        })
        .send({
            success:true,
            message: "Login Successfully",
            token,
            user,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:"false",
            message:"error in login Api",
            error:error.message,
        })
    }
})

const logOutUser = asyncHandler(async(req,res)=>{
    try{
        res.status(200).clearCookie("token", {
            httpOnly: true, // Prevent access from JavaScript
            secure: process.env.NODE_ENV === "production", // Only send secure cookies in production
            sameSite: "Strict", // Prevent CSRF in production
        }).send({
            success: true,
            message: "logout successfully"
        })
    }catch(error){
        console.error(error);
        res.status(500).send({
            success: false,
            message : "error in logout api",
            error : error.message,
        })
    }
})


const getAllUser = asyncHandler(async (req,res)=>{
    try {
        const allUser = await User.find();
        res.status(200).json({
            status :true,
            message : "All User Find Successfully",
            totalUser : allUser.length,
            allUser,
        })
    } catch (error) {
        throw new Error(error);
    }
});


// get a user
const getAUser = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(_id);
    try {
        const getProfile = await User.findById(id);
        res.status(200).json({
            status : true,
            message : "User Found",
            getProfile,
        })
    } catch (error) {
        
    }
})

// update a user profile
const updateUser = asyncHandler(async (req,res)=>{
    const {_id} = req.user;
    validateMongodbId(_id);
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, {new:true}); 
        res.status(200).json({
            status:true,
            message:"Profile Updated Successfully!",
            user});
    } catch (error) {
        throw new Error(error)
    }
});


// delete a user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error deleting user",
            error: error.message
        });
    }
});

// block a user
const blockAUser = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(
        id,
        {isBlocked:true},
        {new : true}
        );
        res.status(200).json({
            status : true, message : "User Blocked Successfully"
        });
        
    } catch (error) {
        throw new Error (error)
    }

});



const unBlockAUser = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const unBlock = await User.findByIdAndUpdate(
        id,
        {isBlocked:false},
        {new : true}
        );
        res.status(200).json({
            status : true, message : "User UnBlocked Successfully"
        });
        
    } catch (error) {
        throw new Error (error)
    }

;

});

// update a password
const updatePassword = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {password} = req.body;

    validateMongodbId(_id);
    
    try {
        const user = await User.findById(_id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the new password is the same as the old password
        if (password && (await user.isPasswordMatched(password))) {
            return res.status(400).json({ message: "Please provide a new password instead of the old one." });
        }

        // If new password is provided, update it
        if (password) {
            user.password = password; // Make sure to hash the password before saving
            await user.save(); // Save the updated user
            return res.status(200).json({ 
            status : true,
            message: "Password updated successfully." });
        } else {
            return res.status(400).json({ message: "Password is required." });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// forgot password token
const forgotPasswordToken = asyncHandler (async (req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email : email});
    if(!user){
        throw new Error("User Not Exists with this email.");
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetLink = `http://localhost:4000/api/user/reset-password/${token}`;
        const data = {
            to : email,
            text : `Hey ${user.firstname + " " + user.lastname}`,
            subject: "Forgot Password",
            html : resetLink,
        };
    
        const msg = await sendEmail(data);
        res.status(200).json({
            resetLink,msg
        });

        // Use the sendEmail function to send the email and wait for the response
        // const emailResponse = await sendEmail(data);
        
        // res.status(200).json(emailResponse);

    } catch (error) {
        throw new Error(error);
    }
});

// forgot password controller

const resetPassword = asyncHandler(async (req,res)=>{
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires : {$gt : Date.now()},
    });
    if(!user){
        throw new Error("Token Expired, Please try Again.");
    };

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({
        status : true,
        message : "Password Reset Successfully"
    })
})


module.exports = { 
    registerAUser,
    loginUser,
    logOutUser,
    getAllUser,
    getAUser,
    updateUser,
    deleteUser,
    blockAUser,
    unBlockAUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
};

