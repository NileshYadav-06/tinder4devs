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
    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );
    if (isValidPassword) {
      // Create a JWT Token
      const manforce = "manforce"
      const token = await jwt.sign({userId: user._id, condom: manforce }, "tinder4DEVS@$790"); // i can use any name in payload inplace of userId
      console.log(token);

      // Add Token to cookies and send response back to the user
      res.cookie("token", token);
      res.send("LOGIN SUCCESSFULL");
      
    } else {
     throw new Error("Invalid Credentials ");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
// GET Profile
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log(cookies);

    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token")
    }
    
    // Validate my token

    const decodedMessage = await jwt.verify(token, "tinder4DEVS@$790");
    console.log("decodeMessage: ",decodedMessage);

    const {userId} = decodedMessage;
    console.log(" userId: ", userId)
    
    const user = await User.findById(userId);
    

    res.send("LOGGED USER:  " + user);
  } catch (err){
    console.log(err);
    res.status(400).send("ERROR: "+ err.message);
  }
  
});
//Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    console.log(user);
    if (!user) {
      res.status(400).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});
//Get user by _id
app.get("/userById", async (req, res) => {
  const { _id } = req.body;
  try {
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong contact to admin");
  }
});
// Feed API- GET/feed - get all the user from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.send(users);
  } catch (err) {
    console.log("error", err);
    res.status(400).send("something went wrong");
  }
});
app.delete("/user", async (req, res) => {
  const { emailId } = req.body;
  try {
    const user = await User.findOneAndDelete({ emailId: emailId });
    if (!user) {
      res.send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("User not deleted");
  }
});
// patch - findByIdAndUpdate method for Update the few fields of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const Allowed_Updates = [
      "photoUrl",
      "password",
      "skills",
      "age",
      "about",
      "gender",
    ];
    // console.log(Object.keys(data));

    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Updates.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update Failed: Some fields are not allowed to update");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills should not be more than 10");
    }
    // if (data?.password) {
    //   throw new Error("Password must be number only");
    // }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User not Found");
    }
    console.log(user);
    res.send(`User updated successfully:${user}`);
  } catch (err) {
    console.log(err.message);
    res.status(400).send("Update Failed: " + err.message);
  }
});
// Patch - findOneAndUpdate method  for tupdating the few fields of the user object(model)
// app.patch("/user", async (req, res) => {
//   const { userEmail } = req.body;
//   const data = req.body;
//   try {
//     const user = await User.findOneAndUpdate({ emailId: userEmail }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     if (!user) return res.status(404).send("User not found");

//     console.log("User updated in DB by findOneAndUpdate()", user);
//     res.send(`User Updated Successfully: ${user}`);
//   } catch (err) {
//     res.status(400).send("UPDATE FAILED: " + err.message);
//   }
// });
// Put method , update the entire resource of the object
app.put("/user", async (req, res) => {
  const { userId } = req.body;
  const data = req.body;
  try {
    const user = await User.replaceOne({ _id: userId }, data);
    console.log("User Updated successfuly", user);
    res.send(`User updated to database ${user}`);
  } catch (err) {
    console.log("error is:", err);
    res.status(400).send("Something went wrong contact to admin");
  }
});

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
