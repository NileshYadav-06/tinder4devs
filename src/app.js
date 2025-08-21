const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

// Handle Auth middleware for all GET POST ,... request
app.use("/admin", adminAuth);
// app.use("/user", userAuth);

// this will handle GET call to /user
app.get("/user",userAuth, (req, res) => {
  res.send("User Handler");
  console.log("hello User");
});
app.get("/user/login", (req, res) => {
  console.log("User login successfully");
  res.send("User logined");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All data sent");
  console.log("hello Admin");
});

app.delete("/admin/deleteUser", (req, res) => {
  res.send(" Deleted a User");
});

app.listen(7777, () => {
  console.log("Server successfully started or listening on port no. 7777");
});
