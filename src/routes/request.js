const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const mongoose = require("mongoose");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserSchema = require("../models/user");


// POST sendConnectionRequest as ignored or interested
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // const loggedInUser = req.user;
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status value is not valid " + status });
      }
      // If there is an existing connection request
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exist",
          data: existingConnectionRequest,
        });
      }
      // Below code logic is written in
      // if (toUserId == fromUserId ) {
      //  // return res.status(400).json({message:${req.user.firstName}, you cannot sent connection req to yourself}) // }

      const toUser = await UserSchema.findById(toUserId);
      if (!toUser) {
        res.status(404).json({
          message:
            "User not found or Provided toUser's id is not present in DB",
        });
      }
      const connectionRequest = new ConnectionRequestModel({
        toUserId,
        fromUserId,
        status,
      });
      const connectionRequestData = await connectionRequest.save();
      //Using a message map for clear and correct message
      const statusMessages = {
        interested: `${req.user.firstName} is interested to make connection with ${toUser.firstName} `,
        ignored: `${req.user.firstName} has ignored ${toUser.firstName} to make connection request`,
      };
      res.json({message: statusMessages[status], connectionRequestData})
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

//POST API for Accepted or Rejected
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `STATUS: ${status} in not valid status` });
      }
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ message: "Invalid requestId" });
      }
      const connectionRequestExist = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequestExist) {
        return res.status(404).json({
          message: "Connection request NOT found in DB Or already reviewed",
        });
      }

      connectionRequestExist.status = status;
      const data = await connectionRequestExist.save();

      //findind the user who show interest in loggedin user or sended the connection
      const fromUser = await UserSchema.findById(
        connectionRequestExist.fromUserId
      );
      // console.log(fromUser)

      const statusMessages = {
        accepted: `${loggedInUser.firstName} has accepted connection request of ${fromUser.firstName} successfully`,
        rejected: `${loggedInUser.firstName} has rejected the connection request `,
      };
      res.json({ message: statusMessages[status] , data});
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }
);

module.exports = requestRouter;
