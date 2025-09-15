const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const validator = require("validator")
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt")
const upload = require("../middlewares/multer");  // your multer config

  


// GET Profile 
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; //i can get user from req.user bcoz i have attached user to req in userAuthmiddleware
    if (!user) {
      throw new Error("user not found");
    }
    res.json({message:`Logged in user is ${user.firstName} ${user.lastName}`, data: user});
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR: " + err.message);
  }
});
// Update Profile Route for editing profile (with photo upload)
profileRouter.patch("/profile/edit", userAuth, upload.single("photoUrl"), async (req, res) => {
  try {
    const LoggedInUser = req.user;
    console.log(LoggedInUser);
     console.log("req.file",req.file);
    // If user uploaded a photo, store path instead of  photoUrl from body
    if (req.file) {
   
      LoggedInUser.photoUrl = req.file.path.replace(/\\/g, "/");
  }

    // validate other fields (exluding phtoUrl from body)
    validateEditProfileData(req);

    //Apply updates for non-file fields
    Object.keys(req.body).forEach((key) => {
      LoggedInUser[key] = req.body[key];
      // console.log(key, req.body[key]);
    });
    console.log(LoggedInUser);
    // i can also use ANOTHER method for Apply update
    // Object.assign(LoggedInUser, req.body)      [Shortest and clear from above]
    await LoggedInUser.save();

   res.json({
     message: `${LoggedInUser.firstName}, your profile updated successfully`,
     data: {
       ...LoggedInUser.toObject(),
       photoUrl: LoggedInUser.photoUrl
         ? `${req.protocol}://${req.get("host")}/${LoggedInUser.photoUrl.replace(
             /\\/g,
             "/"
           )}`
         : null,
     },
   });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
// Update User Password 
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const newPassword = req.body.password;
    if (newPassword && !validator.isStrongPassword(newPassword)) {
      throw new Error("Please set strong password")
    }
    const user = req.user;
    // console.log(user)
    const isPaaswordSame = await bcrypt.compare(newPassword, user.password)
    console.log(isPaaswordSame)
    if (isPaaswordSame) {
      throw new Error("New password can be not same as Previous..!")
    }
    const hashPassword = await bcrypt.hash(newPassword, 10)
    // console.log(hashPassword)
    user.password = hashPassword;
    await user.save()  // saving the user with new password
    res.json({message:`${user.firstName}, your password updated successfully`, data: user} )
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
});

module.exports = profileRouter;
