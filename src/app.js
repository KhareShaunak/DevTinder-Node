const express = require('express');

const {adminAuth, userAuth} = require('../Middleware/auth')

const app = express();

app.use("/user", userAuth, (req, res) => {
    res.send("User data fetched!");
});

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
    res.send("all data has been fetched!")
});

app.delete("/admin/deleteUser", (req, res) => {
    res.send("Deleted a user!");
})

// app.get("/user", [(req, res, next) => {
//     console.log("hello this is the 1st request handler!.");
//     //res.send("This is 1st handler!");
//     next();
// },
//     (req, res, next) => {
//         console.log("This is the second request handler!");
//         //res.send("Hey there, Iam devTinder!");
//         next();
//     },
//     (req, res, next) => {
//         console.log("this is the 3rd handler");
//         //res.send("3rd handler response!");
//         next();
//     }],
//     (req, res, next) => {
//         console.log("this is the 4th handler");
//         res.send("3rd handler response!");
//         next();
//     }
// )




app.listen(7777, () => {
    console.log("Server successfully listening on port 7777");
})