const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../Middleware/auth');
const { validateEditData,validateNewPassword } = require("../utils/validations");
//const { user } = require("../models/user");
const bcrypt = require('bcrypt');


profileRouter.get("/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }
    
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditData(req)) {
            throw new Error("invalid input");
        }
        const userTobeEdited = req.user;
        //console.log(userTobeEdited);
        //res.send(req.body["age"]);
        Object.keys(req.body).forEach(field => {
            userTobeEdited[field] = req.body[field];
        });
        console.log(userTobeEdited);
        //res.send(userTobeEdited);
        await userTobeEdited.save();
        res.send("Profile edited successfully!");

    } catch (error) {
        res.status(400).send("Update Error:" + error.message);
    }
});

//Updating password when user is logged in.
profileRouter.patch("/password", userAuth, async (req, res) => {
    try {
        if (!validateNewPassword(req)) {
            throw new Error("Invalid input");
        }
        const userChangedPassword = req.user;
        const password = await bcrypt.hash(req.body["newPassword"], 10);
        userChangedPassword["password"] = password;
        await userChangedPassword.save();
        res.json({ "message": "Password updated successfully!" });
    } catch(error) {
        res.status(400).send("Password Update Error:" + error.message);
    }
});

module.exports = { profileRouter };

