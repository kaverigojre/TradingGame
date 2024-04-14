const userModelCtrl = require("../../models/userModel");
const organiserModelCtrl = require("../../models/organiserModel");
const bcrypt = require("bcrypt");
const cors = require("cors");
const validate = require("../../jwt");

const signin = async (req, res) => {
  try {
    
    var findUser = await userModelCtrl.userModel.find({
      email: req.body.email,
    });
    console.log(findUser);

    if (findUser.length === 0) {
      console.log("1");
      res.status(500).send("Invalid email or password");
      return;
    }
    findUser = findUser[0];
    if (!findUser.confirmed) {
      console.log("2");
      res.status(500).send("Please Verify your mail");
      return;
    }
    bcrypt.compare(
      req.body.password,
      findUser.password,
      function (err, result) {
        if (result === true) {
          const token = validate.generateToken(req.body.email, "user");
          console.log(token);
          const response = {
            status: "valid",
            name: findUser.name,
            userid: findUser._id,
            email: req.body.email,
            img: findUser.img,
            token: token.token,
          };
          res.status(200).send(JSON.stringify(response));
        } else {
          res.status(500).send("Invalid email or password");
        }
      }
    );
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
const signInOrganiser = async (req, res) => {
  try {
    console.log(req.body);
    const findOraganiser = await organiserModelCtrl.organiserModel.find({
      email: req.body.email,
    });
    if (findOraganiser.length === 0) {
      res.status(404).send("Invalid email or password");
      return;
    }
    bcrypt.compare(
      req.body.password,
      findOraganiser[0].password,
      function (err, result) {
        if (result === true) {
          const token = validate.generateToken(req.body.email, "organiser");
          res.status(200).send({
            name: findOraganiser[0].name,
            email: findOraganiser[0].email,
            userid: findOraganiser[0]._id,
            img: findOraganiser[0].img,
            token: token.token,
          });
        } else {
          res.status(404).send("Invalid email or password");
        }
      }
    );
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
module.exports = { signin, signInOrganiser };
