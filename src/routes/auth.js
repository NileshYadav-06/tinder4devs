const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
// const cookieParser = require("cookie-parser");

const authRouter = express.Router();


// POST SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the data
    validateSignUpData(req);
    const { password, firstName, lastName, emailId } = req.body;
    // console.log("req.body =>", req.body);

    // 1. Check if email exists
    const existingUser = await User.findOne({ emailId });
    // console.log("existingUser: ", existingUser);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Encrypt the Password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log("passwordHash = ", passwordHash);
    // stores password in DB as passwordHash (encrypted password)

    // Creating a  new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    console.log("User added successfully", user);
    res.send(`User added successfully to DB And the user is => ${user}`);
  } catch (err) {
    // console.log("cannot add ", err);
    res.status(400).send("ERROR: " + err.message);
  }
});

// POST LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials ");
    }
    const isValidPassword = await user.validatePassword(password);
    // console.log("isValidPassword: ", isValidPassword)
    if (isValidPassword) {
      // Create a JWT Token
      const token = await user.getJWT(); // token created from schema methods
      console.log("token: ",token);

      // Add Token to cookies and send response back to the user
      res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });  // Token will expires in 7 days
      // we can use {expires: new Date(Date.now() + 7*24*60*60*1000)}  in place of maxAge
      res.send("LOGIN SUCCESSFULL");
    } else {
      throw new Error("Invalid Credentials ");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// POST LOGOUT API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
   maxAge:  0,
  });
  res.send({ message: "USER LOGOUT SUCCESSFULLY !" });
});

module.exports = authRouter;
