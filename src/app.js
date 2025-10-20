const express = require('express')

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello World from test!");
});

app.use("/", (req, res) => {
    res.send("Hello World from Home!");
});


app.listen(7777, () => {
    console.log("Server successfully listening on port 7777");
})