const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")
const mongoose = require("mongoose")
const requestRouter = express.Router();

// POST sendConnectionRequest as ignored or interested 
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      // console.log("status: ",typeof status)
      //validate status to accept only ignored and interested
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid status type: ${status}` });
      }
      //  If there is an existing connectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request already exixt",
          data: existingConnectionRequest,
        });
      }
      // Below code logic is written in
      // if (toUserId == fromUserId ) {
      //  return res.status(400).json({message:`${req.user.firstName}, you cannot sent connection req to yourself`})
      // }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(400).json({ message: `User not found ` });
      }
      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });
      const connectionRequestData = await connectionRequest.save();
      //Using a message map for clear and correct message 
      const statusMessage = {
        interested: `${req.user.firstName} is interested in ${toUser.firstName}`,
        ignored: `${req.user.firstName} has ignored ${toUser.firstName}`,
      };
      res.json({
        message: statusMessage[status],
        connectionRequestData,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

//POST API for Accepted or Rejected
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    // validate status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: `STATUS: ${status} is not valid` });
    }

    // validate requestId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid requestId" });
    }

    // find existing request
    const connectionRequestExist = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequestExist) {
      return res
        .status(404)
        .json({ message: "Connection request not found or already reviewed" });
    }

    // update
    connectionRequestExist.status = status;
    const data = await connectionRequestExist.save();
    
    const statusMessages = {
       accepted: "Connection request accepted successfully",
       rejected: "Connection request rejected",
    };
    
   res.json({ message: statusMessages[status], data });
  } catch (err) {
    res.status(500).json({error: err.message})
  }
});
 
module.exports = requestRouter;
