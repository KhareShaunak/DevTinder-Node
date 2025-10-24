const express = require('express');

const {adminAuth, userAuth} = require('./Middleware/auth')

const app = express();

const connectDB = require('./config/database');

const User = require('./models/user');

app.use(express.json()); //Middleware for JSON Parsing

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
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