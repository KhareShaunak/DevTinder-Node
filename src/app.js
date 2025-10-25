const express = require('express');

const {adminAuth, userAuth} = require('./Middleware/auth')

const app = express();

const connectDB = require('./config/database');

const User = require('./models/user');

app.use(express.json()); //Middleware for JSON Parsing


//signup API
app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("user got saved successfully!");
    } catch (err) {
        res.status(400).send("User cannot get saved.");
    }

});

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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const update = req.body;
    const options = {
        returnDocument: "before", 
        upsert: "true" };
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, update, options);
        console.log(updatedUser);
        res.status(200).send("User updated successfully!");
    } catch (error) {
        res.status(400).send("Something went wrong!")
    }

});

// PATCH /userByEmail -> find user by Email and update information
app.patch("/userByEmail", async (req, res) => {
    const userEmail = req.body.emailId;
    const update = req.body;
    const options = {
        returnDocument: "before",
        upsert: true};
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