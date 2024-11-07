const { postTutorial, getATutorial, updateTutorial, deleteTutorial, allTutorial } = require("../controllers/tutorialCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const tutorialRouter = require("express").Router();


tutorialRouter.post("/", authMiddleware, isAdmin,  postTutorial);
tutorialRouter.get("/:type/:slug", getATutorial)
tutorialRouter.put("/:id", authMiddleware, isAdmin,  updateTutorial)
tutorialRouter.delete("/:id", authMiddleware, isAdmin, deleteTutorial);
tutorialRouter.get("/all", authMiddleware, isAdmin, allTutorial)


module.exports = { tutorialRouter}