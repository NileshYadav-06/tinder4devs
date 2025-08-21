const mongoose = require("mongoose")
const DB_URL = "mongodb://localhost:27017/tinderForDevs"
const dbConnect = () => {
    mongoose.connect(DB_URL).then(() => {
        console.log("Db connected successfully")
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    })
}

module.exports = dbConnect;