const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, password, emailId } = req.body;
  if (!firstName) {
    throw new Error("Please provide fisrtName ");
  } else if (!lastName) {
    throw new Error("Please provide lastName ");
  } else if (
    firstName.length < 3 ||
    firstName.length > 45 ||
    lastName.length < 3 ||
    lastName.length > 45
  ) {
    throw new Error(
      "First and Last Name length should bein b etween ( 3>= to <45 )"
    );
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Not a valid emailId, pls input correct Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password");
  }
};

const validateEditProfileData = (req) => {
 
  const { photoUrl, age, skills, gender, about } = req.body;
  
  // Only validate if no  file was uploaded
  //   if (!req.file && photoUrl && !validator.isURL(photoUrl)) {
  //     throw new Error("Photo Url link is invalid");
  // }
   if (skills && skills.length > 10) {
      throw new Error("Skills can have a maximum of 10");
    } else if (about && about.length > 160) {
      throw new Error("About must be 160 characters or less ");
    } else if (age && (age < 18 || age > 90)) {
      throw new Error("Age must be above 17 and lower 91");
    }

    const allowedEditFields = [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "skills",
      "about",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    );
    if (!isEditAllowed) {
      throw new Error("Invalid field(s) in update request")
    }
  
  
  return isEditAllowed;
   
  
};
module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
