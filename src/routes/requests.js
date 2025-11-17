const express = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { userAuth } = require('../Middleware/auth');
const { default: mongoose } = require('mongoose');

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


requestRouter.post("/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        // 1. Receiver of connection request must be logged in
        //2. Validate the status
        //3. Find the connectionRequest Where status of request is interested, 
        //, and it should have valid requestId and ToUserId
        //4. Change the status of the found connectionRequest into the given status (Accepted/Rejected)
        //in Connection request and save that connection request
        try { 
            const loggedInUser = req.user;
            const { status, requestId } = req.params;
        //const requestId = req.params.requestId;
        const allowedStatus = ["accepted", "rejected"];
        
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type!" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            status: "interested",
            toUserId: loggedInUser._id
        });

        if (!connectionRequest) {
            res.status(404).json({ message: "Connection request not found!" });
        }

            connectionRequest.status = status;
            console.log(connectionRequest.status);
            console.log(connectionRequest instanceof mongoose.Document);


            const data = await connectionRequest.save();
            
            res.json({
                message: "Connection request" + connectionRequest.status,
                data
            });
            

        } catch (error) {
            res.status(400).json({ message: "Error : " + error.message });
        }
        

    });
 
module.exports = { requestRouter };


