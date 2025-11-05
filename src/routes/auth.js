const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { validateSignUpData } = require('../utils/validations');
const authRouter = express.Router();

// POST /signup
authRouter.post("/signup", async (req, res) => {
    const {firstName, lastName, password, emailId, age, gender } = req.body
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        firstName, lastName, password: hashedPassword, emailId, gender, age
    });
    console.log(req.body);
    try {
        //This function validates the data send by user while signing up
        //Logic is written in "../utils/validations.js"
        validateSignUpData(req);
        
        
        //Checks whether there are only required fields in payload of request
        //Otherwise discard the request
        const ALLOWED_FIELDS = ["firstName", "lastName", "emailId",
            "password", "gender", "photoUrl", "about", "skills", "age"
        ];

        const isValidUser = Object.keys(req.body).every((key) => {
            return ALLOWED_FIELDS.includes(key);
        });
        
        console.log(isValidUser);

        if (!isValidUser) {
            throw new Error("Not a valid user!");
        }
        
        //checks the age of the user
        if (user?.age < 18) {
            throw new Error("age must be over 18!");
        }

        //Saves the user info in database
        await user.save();
        res.send("user got saved successfully!");
    } catch (err) {
        res.status(400).send("User cannot get saved:" + err.message);
        console.log(err.message);
    }

});

// POST /login
authRouter.post("/login", async (req, res) => {
    try {
    //Find the user by email
    const { emailId, password } = req.body;
    const user = await User?.findOne({ emailId: emailId });
    if (!user) {
        throw new Error("Invalid credentials!")
        }
    console.log(user.password);
    //Comparing password
    const isPasswordValid = user.validatePassword(password);
    if (isPasswordValid) {
        //Set set-cookie header
        const token = user.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 2 * 3600000)
        });
        res.send("Login successful!!");
    } else {
        throw new Error("Invalid credentials!");
    }
    } catch (err) {
        res.status(400).send("LOGIN ERROR:" + err.message);
    }
    
});

//POST /logout
//Client-side deletion - Clear the cookie immediately
authRouter.post("/logout", async (req, res) => {
    try {
        res.clearCookie('token', { path: '/' });
        res.status(200).send('Logged out successfully.');
    } catch (err) {
        err.status(400).res("LOGOUT ERROR:" + err.message);
    }
});




module.exports = { authRouter };