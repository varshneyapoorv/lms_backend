const express = require("express");
const { registerAUser, loginUser, getAllUser, updateUser, deleteUser, getAUser, blockAUser, unBlockAUser, updatePassword } = require("../controllers/userCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

// all post routes
userRouter.post("/register", registerAUser);
userRouter.post("/login", loginUser);


// all get routes
userRouter.get("/all-users", isAdmin, getAllUser);
userRouter.get("/:id", authMiddleware, getAUser);


// all put routes
userRouter.put("/update-profile",authMiddleware, updateUser);
userRouter.put("/block/:id", authMiddleware, isAdmin, blockAUser);
userRouter.put("/unblock/:id", authMiddleware, isAdmin, unBlockAUser);
userRouter.put("/update-password", authMiddleware, updatePassword)


// all delete routes
userRouter.delete("/:id", authMiddleware, isAdmin, deleteUser);



module.exports = userRouter;