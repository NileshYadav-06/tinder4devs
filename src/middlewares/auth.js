const adminAuth = (req, res, next) => {
  // Logic of checking if the req is authourizd
  console.log("Admin Auth is getting checked!!");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("unauthorized admin request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  // Logic of checking if the req is authourizd
  console.log("User Auth is getting checked!!");
  const token = "nilesh";
  const isUSerAuthorized = token === "nilesh";
  if (!isUSerAuthorized) {
    res.status(401).send("unauthorized user request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
