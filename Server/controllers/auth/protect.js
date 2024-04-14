const userModelCtrl = require("../../models/userModel");
const organiserModelCtrl = require("../../models/organiserModel");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const protect = async (req, res, next) => {
  try {
    if (!req.headers.token) {
      res.status(401).send("Token not found");
      return;
    }
    var tokenbody = jwt.verify(req.headers.token, process.env.SECRET_KEY);
    console.log(tokenbody);
    if (tokenbody.role === "user") {
      let user = await userModelCtrl.userModel.find({ email: tokenbody.email });
      if (!user) {
        res.status(401).send("Invalid Auth Token");
        return;
      }
    } else if (tokenbody.role === "organiser") {
      let organiser = await organiserModelCtrl.organiserModel.find({
        email: tokenbody.email,
      });
      if (!organiser) {
        res.status(401).send("Invalid Auth Token");
        return;
      }
    }
    req.user = tokenbody;
    next();
  } catch (e) {
    console.log("Invalid Token");
    res.status(401).send("Invalid Token");
  }
};
module.exports = { protect };
