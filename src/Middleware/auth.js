const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is invalid!");
        }

        console.log(token); 

        const decodedObj = jwt.verify(token, 'topSecret');
        const { _id } = decodedObj;
        //console.log(_id);
        const user = await User.findById(_id);
        console.log(user);
        if (user) {
            req.user = user;
            console.log(req.user);
        } else {
            throw new Error("User not found!");
        }
        next();
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }
};

module.exports = { userAuth };