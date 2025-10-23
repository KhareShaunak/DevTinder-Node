const express = require('express');

const {adminAuth, userAuth} = require('./Middleware/auth')

const app = express();

const connectDB = require('./config/database');

const User = require('./models/user');

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Shaunak",
        lastName: "Khare",
        emailId: "shaunak@gmail.com",
        password: "Shaunak@12345",
        age: 25,
        gender: "male"
    };

    const user = new User(userObj);
    try {
        await user.save();
        res.send("user got saved successfully!");
    } catch (err) {
        res.status(400).send("User cannot get saved.");
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