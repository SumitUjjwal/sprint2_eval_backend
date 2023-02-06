const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
       name: String,
       email: String,
       role: {type: String, enum: ["manager", "user"], default: "user"},
       password: String
})

const UserModel = mongoose.model("user", userSchema);

module.exports ={
       UserModel
}