const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Auth Middleware to validate the JWT token
const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token; // Token from cookies
    
    // If no token is found
    if (!token) {
        return res.status(401).json({ message: "User not authenticated." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded user id
        const user = await User.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        // Attach the user object to the request
        req.user = user;

        next(); // Move to the next middleware/route handler
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token or token expired. Please log in again." });
    }
});


// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            success: false,
            message: "User not authenticated.",
        });
    }

    // Check if the user has an "admin" role
    if (!req.user.roles || !req.user.roles.includes("admin")) {
        return res.status(403).send({
            success: false,
            message: "Admin access required.",
        });
    }

    // If the user has an admin role, continue to the next middleware/route handler
    next();
};




// Middleware to check if the user is an instructor
const isInstructor = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated." });
    }

    const { email } = req.user; // Now safe to destructure
    const user = await User.findOne({ email });

    if (!user || !user.roles || !user.roles.includes("instructor")) {
        return res.status(403).json({ message: "You are not an Instructor." }); // Forbidden
    }
    
    next(); // Call next() only if the user is an instructor
});



module.exports = {
    authMiddleware,
    isAdmin,
    isInstructor,
};
