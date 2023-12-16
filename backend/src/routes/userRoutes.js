//similar to controller java classes ( FYI)
const express = require('express');
const {toggleActive,getUser,toggleRole,getAllUsers } = require('../controllers/userController');
const userRouter = express.Router();


userRouter.put("/:userId/toggle-active/",toggleActive)
userRouter.put("/:userId/toggle-role/",toggleRole)
userRouter.get("/:userId",getUser)
userRouter.get("/",getAllUsers)

//if we want to user userRouter objects in other files, we have to export it
module.exports = userRouter;