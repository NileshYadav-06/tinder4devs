const express = require("express");
// const dbConnect = require("./config/database");
const app = express();

// dbConnect();
 
app.get("/getUserData", (req, res) => {
  try {
    // logic of DB  call and get user Data

    throw new Error("dncjdjcidsci");
    res.send("User data sent");
 } catch (err) {
   res.status(500).send("Some Error occurs contact support team");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    //Log your error
    console.log(err);
    res.status(500).send("something went wrong");
  }
});

app.listen(7777, () => {
  console.log("Server successfully started or listening on port no. 7777");
});
