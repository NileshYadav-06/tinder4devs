const express = require("express");
const { dbConnect } = require("./config/database");
// require("./config/database");
const app = express();
const User = require("./models/user");
const { SchemaTypeOptions } = require("mongoose");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); // this is inbuilt middleware user for reading the json data (convert it into js objectnp)
app.use(cookieParser()); // this middleware is use for readind the cookies

// POST SIGNUP
app.post("/signup", async (req, res) => {
  try {
    // Validate the data
    validateSignUpData(req);
    const { password, firstName, lastName, emailId } = req.body;
    console.log("req.body =>", req.body);

    // 1. Check if email exists
    const existingUser = await User.findOne({ emailId });
    console.log("existingUser: ", existingUser);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Encrypt the Password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("passwordHash = ", passwordHash);
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
    res.send(`User added successfully And the user is => ${user}`);
  } catch (err) {
    console.log("cannot add ", err);
    res.status(400).send("ERROR: " + err.message);
  }
});
// POST LOGIN
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials ");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      // Create a JWT Token
      const token = await user.getJWT()  // created from schema methods
      console.log(token);

      // Add Token to cookies and send response back to the user
      res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
      // we can use {expires: new Date(Date.now() + 7*24*60*60*1000)}  in place of maxAge
      res.send("LOGIN SUCCESSFULL");
    } else {
      throw new Error("Invalid Credentials ");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
// GET Profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; //i can get user from req.user bcoz i have attached user to req in userAuthmiddleware 

    res.send("LOGGED USER:  " + user );
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR: " + err.message);
  }
});
// POST sendConnectionRequest 
app.post("/sendConnectionReq", userAuth, (req, res) => {
  try {
    const user = req.user;

    res.send(user.firstName + " Sent the Connection request ")
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})
 
dbConnect()
  .then(() => {
    console.log("Database connection stablished...");
    app.listen(7777, () => {
      console.log("Server is succesfully listening on port no 7777");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
