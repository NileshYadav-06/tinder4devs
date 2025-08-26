const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 3,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
        trim: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    age: {
      type: Number,
        min: 18,
      max: 80,
        required: true,
      
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender should be male, female, or others");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://hancockogundiyapartners.com/wp-content/uploads/2019/07/dummy-profile-pic-300x300.jpg",
    },
    about: {
      type: String,
      default: "This is the default Description(about) of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
