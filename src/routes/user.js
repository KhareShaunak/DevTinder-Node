const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../Middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { Mongoose } = require('mongoose');
const SAFE_DATA_FIELDS = ["firstName", "lastName", "photoUrl", "age", "gender", "skills"];
const User = require("../models/user");


//Get all pending requests for a loggedIn user
userRouter.get('/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const ConnectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", SAFE_DATA_FIELDS);

        res.json({
            message: "data fetched successfully.",
            data: ConnectionRequests
        });

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

//Get all connections of loggedIn user
userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        //Getting user from userAuth
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: 'accepted' },
                { fromUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate("toUserId", SAFE_DATA_FIELDS)
            .populate("fromUserId", SAFE_DATA_FIELDS); 
        
        const data = connections.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        
        res.json({
            message: "Connections fetched successfully.",
            data
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Get all cards of user which are not connections or interested users of loggedIn 
//user
userRouter.get('/feed',userAuth, async (req, res) => {
    try { 
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1)*limit; 

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }
        ).select("fromUserId toUserId");
    
        
        const hideUserFromFeed = new Set();

        connectionRequests.forEach((request) => {
            hideUserFromFeed.add(request.fromUserId.toString());
            hideUserFromFeed.add(request.toUserId.toString());
        });

        const usersOnFeed = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: {$ne: loggedInUser._id}}
            ]
        }).select(SAFE_DATA_FIELDS).skip(skip).limit(limit);

        res.send(usersOnFeed);


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
module.exports = {
    userRouter,
}