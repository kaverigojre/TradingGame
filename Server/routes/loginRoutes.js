const express = require("express");
let routes = express.Router();
const signinCtrl = require("../controllers/login/signinController");
const authloginctrl = require("../controllers/login/authlogin");
const changePasswordCtrl = require("../controllers/login/changepassword");
const protect = require("../controllers/auth/protect");
const restrict = require("../controllers/auth/restrict");
routes.post("/signin", signinCtrl.signin);
routes.post("/signinOrganiser", signinCtrl.signInOrganiser);
routes.post("/authlogin", authloginctrl.authlogin);
routes.post(
  "/changepassword",
  protect.protect,
  restrict.restrict("user", "organiser"),
  changePasswordCtrl.changePassword
);
module.exports = routes;
