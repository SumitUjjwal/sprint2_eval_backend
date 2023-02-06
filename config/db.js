const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL;

const connect = mongoose.connect(MONGODB_URL);

module.exports = {
       connect
}