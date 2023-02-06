const express = require('express');
const { connect } = require("./config/db");
const {authenticationRouter} = require("./routes/authentication.route")
const {authenticate} = require("./middlewares/authenticator.middleware");
const {authorize} = require("./middlewares/authorize.middleware");

require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.get("/", (req,res) => {
       res.json({"msg": "Welcome to the eval backend!"})
})

app.use("/userAuth", authenticationRouter);
app.use(authenticate);
app.get("/goldRate", authorize(["manager", "user"]), (req, res) => {
       res.json({"msg": "accessing protected endpoint: /goldrate"})
})
app.get("/userstats", authorize(["manager"]), (req, res) => {
       res.json({ "msg": "accessing protected endpoint: /userstats" })
})


app.listen(PORT, async()=>{
       try {
              await connect;
              console.log("Connected to database");
              console.log(`listening on ${PORT}`);
       } catch (error) {
              console.log(`Error connecting to database: ${error.message}`);
       }
});