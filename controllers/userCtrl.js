const { generateToken } = require("../config/jwtToken");
const validateMongodbId = require("../config/validateMongoDbId");
const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");

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
const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    // check if user exists or not
    const findUser = await User.findOne({email:email});
    if(findUser && (await findUser.isPasswordMatched(password))){
        res.status(200).json({
            status : true,
            message : "Logged In Successfully!",
            token : generateToken(findUser?.id),
            role : findUser?.roles,
            username : findUser?.firstname + " " + findUser?.lastname,
            user_image : findUser?.user_image,
        })
    }else{
        throw new Error("Invalid Credentials");
    }
})


// get all user
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




module.exports = { 
    registerAUser,
    loginUser,
    getAllUser,
    getAUser,
    updateUser,
    deleteUser,
    blockAUser,
    unBlockAUser,
    updatePassword,
};

