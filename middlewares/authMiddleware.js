const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Auth Middleware to validate the JWT token
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];

        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                if (!user) {
                    return res.status(401).json({ message: "Not Authorized, User not found" });
                }

                req.user = user; // Attach the user to the request object
                next(); // Call next to proceed to the next middleware/route handler
            } else {
                return res.status(401).json({ message: "Not Authorized, No token provided" });
            }
        } catch (error) {
            return res.status(401).json({ message: "Not Authorized, Please Login Again", error: error.message });
        }
    } else {
        return res.status(401).json({ message: "No token attached to the header" });
    }
});

// Middleware to check if the user is an admin
const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const user = await User.findOne({ email });

    if (!user || user.roles !== "admin") {
        return res.status(403).json({ message: "You are not an Admin." }); // Forbidden
    } else {
        next(); // Call next() if the user is an admin
    }
});

// Middleware to check if the user is an instructor
const isInstructor = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const user = await User.findOne({ email });

    if (!user || !user.roles || !user.roles.includes("instructor")) {
        return res.status(403).json({ message: "You are not an Instructor." }); // Forbidden
    } else {
        next(); // Call next() only if the user is an instructor
    }
});

module.exports = {
    authMiddleware,
    isAdmin,
    isInstructor,
};
