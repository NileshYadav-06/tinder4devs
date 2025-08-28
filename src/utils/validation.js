const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, password, emailId } = req.body;
  if (!firstName || !lastName) {
    throw new Error("You have to enter fisrtName and lastName");
  } else if (
    firstName.length < 3 ||
    firstName.length > 45 ||
    lastName.length < 3 ||
    lastName.length > 45
  ) {
    throw new Error(
      " First Name and Last Name should be of length in between ( 3>= to <45 ) "
    );
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Not a valid emailId, pls input correct Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password");
  }
};

module.exports = {
  validateSignUpData,
};
