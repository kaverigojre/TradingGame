const express = require("express");
let routes = express.Router();

const addWalletUser = require("../controllers/user/addWalletUser");
const getUserCtrl = require("../controllers/user/getUser");
const protect = require("../controllers/auth/protect");
const restrict = require("../controllers/auth/restrict");
const userProfilechangeCtrl = require("../controllers/user/userprofilechange");
routes.post(
  "/addwallet",
  protect.protect,
  restrict.restrict("user"),
  addWalletUser.addwalletUser
);
routes.get(
  "/:id",
  protect.protect,
  restrict.restrict("user"),
  getUserCtrl.getUser
);
routes.post("/userprofilechange", userProfilechangeCtrl.userProfilechange)
module.exports = routes;
