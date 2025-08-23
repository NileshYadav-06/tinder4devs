const mongoose = require("mongoose");
const DB_URL =
  "mongodb+srv://nilesh4149yaduvanshi:nilesh428yaduvanshi@namastenodejs.ydm2qtc.mongodb.net/tinder4Devs";
const dbConnect = async () => {
  await mongoose.connect(DB_URL);
};

module.exports = {
  dbConnect
};
