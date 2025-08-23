const express = require("express");
const { dbConnect } = require("./config/database");
// require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log("req.body =>", req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully ");
  } catch (err) {
    console.log("cannot add ", err);
    res.status(400).send("User cannot be added");
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
