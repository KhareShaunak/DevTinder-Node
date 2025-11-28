const express = require('express');
const { userAuth } = require('./Middleware/auth');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const { Error } = require('mongoose');
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/requests');
const { userRouter } = require('./routes/user');



app.use(express.json()); //Middleware for JSON Parsing

app.use(cookieParser());


//Mounting of routes 
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);







//GET /getUserById
app.get("/getUserByEmail", async (req, res) => {
    const user = await User.findOne({ emailId: req.body.emailId });
    console.log(user);
    try {
        if (!user) {
            res.status(400).send("User not found!");
        } else {
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("Something went wrong!");
    }
});

//GET /profil


//GET /feed
app.get("/feed", async (req, res) => {
    const users = await User.find({});
    try {
        if (users.length !== 0) {
            res.send(users);
        } else {
            res.status(400).send("Users not found!");
        }
    } catch (error) {
        res.status(400).send("Something went wrong!");
    }
});

//DELETE /user (deleting user by Id)

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try { 
        const user = await User.findByIdAndDelete(userId);
        console.log(user);
        res.status(200).send("User deleted successfully!");
    } catch (error) {
        res.status(400).send("Something went wrong!");
    }
});

// PATCH /user -> find user by id and update information
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const update = req.body;
    const options = {
        returnDocument: "after", 
        upsert: true,
        runValidators: true };
    try {
        const ALLOWED_UPDATES = ["age", "skills", "gender", "password", "photoUrl",
            "about"
        ];
        const isUpdateAllowed = Object.keys(update).every((key) => {
        return ALLOWED_UPDATES.includes(key);
        })

        if (!isUpdateAllowed) {
            throw new Error("User cannot get updated!");
        }

        //Skiils should not be greater than 50;
        if (update?.skills.length > 10) {
            throw new Error("skills must be less than 10.");
        }

        const updatedUser = await User.findByIdAndUpdate(userId, update, options);
        console.log(updatedUser);
        
        

        res.status(200).send("User updated successfully!");
    } catch (error) {
        res.status(400).send("Update Error:" + error.message);
    }

});

// PATCH /userByEmail -> find user by Email and update information
app.patch("/userByEmail", async (req, res) => {
    const userEmail = req.body.emailId;
    const update = req.body;
    const options = {
        returnDocument: "after",
        upsert: true,
        runValidators: true};
    try {
        const updatedUser = await User.findOneAndUpdate({emailId: userEmail}, update, options);
        console.log(updatedUser);
        res.status(200).send("User updated successfully!");
    } catch (error) {
        res.status(400).send("Something went wrong!")
    }

});

connectDB().then(() => {
    console.log("Database connected successfully!");
    app.listen(7777, () => {
        console.log("Server listening successfully to 7777");
    })
}).catch((err) => {
    console.error("Database cannot get connected!");
});