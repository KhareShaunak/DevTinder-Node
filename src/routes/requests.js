const express = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { userAuth } = require('../Middleware/auth');

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //Validation 1: allowed status types : interested and ignored
        const allowedStatus = ["interested", "ignored"]; 
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type:" + status
            });
        }

        //Validation 2: Connection request to a existing user.
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({
                message: "User not found!"
            })
        }

        //Validation 3: Allowing users sending request only once
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({
                message: "Connection request already exists!"
            });
        }

        const Request = new ConnectionRequest({fromUserId, toUserId, status});
        const data = await Request.save();
        res.json({
            message: "Connection has been sent successfully!",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid connection request: " + error.message, });
    }
});



module.exports = { requestRouter };


