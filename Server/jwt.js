const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_KEY;
const generateToken = (email, role) => {
  var obj = {
    uid: email,
    role: role,
    time: Date.now(),
  };
  const token = jwt.sign(obj, secretKey, {
    expiresIn: "5d",
  });
  return { token: token };
};
module.exports = { generateToken };
