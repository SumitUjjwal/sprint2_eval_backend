const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {UserModel} = require("../models/users.model");
const cookieParser = require("cookie-parser");
const fs = require("fs");

require("dotenv").config();
const NORMAL_SECRET_KEY = process.env.NORMAL_SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const authenticationRouter = express.Router();
authenticationRouter.use(cookieParser());


authenticationRouter.get("/", (req, res) => {
       // console.log(req.headers.token)
       res.json({"msg": "authentication endpoint"});
})

authenticationRouter.post("/signup", async(req, res) => {
       const {name, email, role, password} = req.body;
       const checkExisting = await UserModel.findOne({email});
       if (!checkExisting){
              try {
                     bcrypt.hash(password, 2, async(err, hash) => {
                            if(err){
                                   res.json({"msg": `Error in hashing password: ${err.message}`});
                                   console.log(err);
                            }
                            else{
                                   const user = new UserModel({name, email, role, password: hash});
                                   await user.save();
                                   res.json({"msg": `${user.name} has been registered successfully`});
                            }
                     })
              } catch (error) {
                     console.log(error);
                     res.json({"msg": `${error.message}`});
              }
       }else{
              res.json({"msg": `${email} already registered!! Please try to login!!`});
       }
});

authenticationRouter.post("/login", async (req,res) => {
       const {email, password} = req.body;
       const checkExisting = await UserModel.findOne({email});
       if(checkExisting){
              try {
                     bcrypt.compare(password, checkExisting.password, async(err, result) => {
                            if(err){
                                   res.json({"msg": `${err.message}`});
                            }
                            else{
                                   const token = jwt.sign({userId: checkExisting._id, role: checkExisting.role}, NORMAL_SECRET_KEY, {expiresIn: "1m"});
                                   const refresh_token = jwt.sign({ userId: checkExisting._id, role: checkExisting.role }, REFRESH_SECRET_KEY, {expiresIn: "5m"});
                                   req.headers.token = token;
                                   res.cookie("token", token, {httpOnly: true});
                                   res.cookie("refresh_token", refresh_token, {httpOnly: true});
                                   res.json(`${checkExisting.name} has logged in successfully`); 
                            }
                     })
              } catch (error) {
                     console.log(error);
                     res.json({"msg": `${error.message}`});
              }
       }
       else{
              res.json({"msg": `${email} not registered!! Please try to register!!`});
       }
})

authenticationRouter.get("/genNewToken", async(req, res) => {
       const refresh_token = req.cookies.refresh_token;
       if(refresh_token){
              const decode = jwt.verify(refresh_token, REFRESH_SECRET_KEY);
              const token = jwt.sign({userId: decode.userId, role: decode.role}, NORMAL_SECRET_KEY, {expiresIn: "1m"});
              res.cookie("token", token, { httpOnly: true });
              res.cookie("refresh_token", refresh_token, { httpOnly: true });
              res.json({"msg": `New token generated`})
       }else{
              res.json({"msg": `Please try to login again!!`})
       }
})

authenticationRouter.get("/logout", async(req, res)=>{
       const token = req.headers.token;
       const blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));
       if(token){
              blacklist.push(token);
              fs.writeFileSync("./blacklist.json", JSON.stringify(blacklist));
              res.clearCookie("token").clearCookie("refresh_token");
              res.json({"msg": "User logged out!!"});
       }
       else{
              res.json({"msg": "Please login first"})
       }
})

module.exports = {
       authenticationRouter
}