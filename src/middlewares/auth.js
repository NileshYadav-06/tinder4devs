const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookies
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token ) {
      throw new Error("The token is invalid ....!");
    }
    // validate the token
    const decodedObj = await jwt.verify(token, "tinder4DEVS@$790");

    // find the user
    const { userId } = decodedObj;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};  
