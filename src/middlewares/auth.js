const adminAuth = (req, res, next) => {
  // Logic of checking if the req is authourizd
  console.log("Admin AUth is getting checked!!");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  // Logic of checking if the req is authourizd
  console.log("Admin AUth is getting checked!!");
  const token = "nilesh";
  const isAdminAuthorized = token === "nilesh";
  if (!isAdminAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
