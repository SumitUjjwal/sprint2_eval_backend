const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();
const NORMAL_SECRET_KEY = process.env.NORMAL_SECRET_KEY;

const authenticate = (req, res, next) => {
       const token = req.headers.token;
       // console.log(token);
       if(token){
              const blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf8"));
              if(blacklist.includes(token)){
                     res.json({"msg": "Please Login again"});
              }
              else{
                     const decode = jwt.verify(token, NORMAL_SECRET_KEY, (err, decoded) => {
                            if(err){
                                   res.json({"msg": err.message});
                            }
                            else{
                                   const userrole = decoded.role;
                                   req.headers.userrole = userrole;
                                   next();
                            }
                     })
              }
       }else{
              res.json({ "msg": "Please Login again" });
       }
};


module.exports ={
       authenticate
}