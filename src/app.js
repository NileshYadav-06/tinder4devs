const express = require("express");
const { dbConnect } = require("./config/database");
// require("./config/database");

const app = express();

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
