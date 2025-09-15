const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills about";

// User GET api - Get all the pending connection requestfor the logediIn user  ;
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); // Below and this line works same "firstName LastName" work as filter that which field to popoylate
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({ message: "Data fetched successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User GET Api - Get all the user's Connection
userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const connectionRequest = await ConnectionRequestModel.find({
    $or: [
      { fromUserId: loggedInUser._id, status: "accepted" },
      { toUserId: loggedInUser._id, status: "accepted" },
    ],
  })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

  console.log(connectionRequest);
  const data = connectionRequest.map((row) => {
    if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
      // here === cant work directly so we convert it to string and use it
      return row.toUserId;
    }
    return row.fromUserId;
    // we can use mongoosse checks method to do the same things,
    //   if (row.fromUserId._id.equals(loggedInUser._id)){
    //       return row.toUserId;
    //   }
    //   return row.fromUserId;
  });

  res.json({
    message: loggedInUser.firstName + "'s accepted connections, data fetched",
    data: data,
  });
});

// Route: Get "User Feed"
// Purpose: Show a list of users that the logged-in user can send a connection request to
// Exclude:
//   1. The logged-in user themselves
//   2. Users with whom the logged-in user already has a connection request (sent or received)
//   3. Users with whom the connection is accepted or rejected

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    // 1. Identify the logged-in user (from auth middleware)
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1; // parseInt() convert to int
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 50) {
      limit = 50;
      }
   
    // limit = limit > 50 ? 50 : (k = limit);  this line  and above code do the same
    const skip = (page - 1) * limit;

    // 2. Find all connection requests involving the logged-in user
    //    (either as sender or receiver, with any status)
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId status");
    // Note: we only need the ids + status, no extra data

    // 3. Prepare a Set of users to hide from feed
    //    (because they are already connected/attempted connection)
    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString()); // user who sent
      hideUsersFromFeed.add(req.toUserId.toString()); // user who received
    });

    // 4. Fetch all users who are *not* in the "hidden" set
    //    $nin → "not in" condition
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
      // exclude unwanted users
    })
      .select(USER_SAFE_DATA)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    // USER_SAFE_DATA is probably a constant with safe fields (firstName, lastName, etc.)

    // 5. Log results for debugging
    // console.log(users);
    // console.log(hideUsersFromFeed);

    // 6. Send response with filtered users
    res.json({
      message: loggedInUser.firstName + "'s feed data ",
      data: users,
    });
  } catch (err) {
    // 7. Handle errors
    res.status(400).send({ error: err.message });
  }
});

module.exports = userRouter;
