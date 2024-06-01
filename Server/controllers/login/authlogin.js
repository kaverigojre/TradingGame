const userModelCtrl = require("../../models/userModel");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const authlogin = async (req, res) => {
  try {
    var tokenbody = jwt.verify(req.body.token, process.env.SECRET_KEY); //added env file
    var user = await userModelCtrl.userModel.find({ email: tokenbody.uid });

    if (user.length > 0) {
      user = user[0];
      var obj = {
        name: user.name,
        email: user.email,
        userid: user._id,
        img:user.img,
      };
      res.send(obj);
    } else {
      console.log("User not found");
      res.status(500).send("User not found");
      return;
    }
  } catch (e) {
    console.log("Invalid Token");
    res.status(500).send("Invalid Token");
  }
};
module.exports = { authlogin };
