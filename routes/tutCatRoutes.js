const { postTutorialCategory, getAllTutCategories, getATutCat, updateATutCat, deleteATutCat } = require("../controllers/tutCatCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");



const tutCatRouter = require("express").Router();


tutCatRouter.post("/post",  authMiddleware, isAdmin, postTutorialCategory);
tutCatRouter.get("/", getAllTutCategories);
tutCatRouter.get("/:id", authMiddleware, isAdmin, getATutCat);
tutCatRouter.put("/:id", authMiddleware, isAdmin, updateATutCat);
tutCatRouter.delete("/:id", authMiddleware, isAdmin, deleteATutCat);


module.exports = {
    tutCatRouter,
}