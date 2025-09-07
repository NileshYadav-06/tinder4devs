const express = require("express");
const { dbConnect } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json()); // this is inbuilt middleware user for reading the json data (convert it into js objectnp)
app.use(cookieParser()); // this middleware is use for reading the cookies and
//  you can access cookies using req.cookies in any route — you don’t need to add cookieParser() again in each route file.

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


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
