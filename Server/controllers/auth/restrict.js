const userModelCtrl = require("../../models/userModel");
const organiserModelCtrl = require("../../models/organiserModel");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const restrict = (...roles) => {
  return (req, res, next) => {
    try {
     
      if (roles.includes(req.user.role)) {
       
        next();
      } else {
        res.status(401).send("UNAUTHORIZED");
      }
    } catch (e) {}
  };
};
module.exports = { restrict };
