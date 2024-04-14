const express = require("express");
let routes = express.Router();
const signupCtrl=require("../controllers/login/signupController");

routes.post("/signup",signupCtrl.signup);
routes.post("/signupOrganiser",signupCtrl.signupOrganiser);
routes.get("/verify-email",signupCtrl.verify);
module.exports = routes;
