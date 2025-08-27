const mongoose = require("mongoose");
const validator = require("validator");

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
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter strong a Passord: " + value);
        }
      },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo ULR: " + value);
        }
      },
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
