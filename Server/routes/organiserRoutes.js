const express = require("express");
let routes = express.Router();
const getOrganiserCtrl = require("../controllers/organiser/organiser");
const addwalletorganiserCtrl = require("../controllers/organiser/addwalletorganiser");
const organiserProfilechange = require("../controllers/organiser/organiserprofilechange");
const protect = require("../controllers/auth/protect");
const restrict = require("../controllers/auth/restrict");
routes.post(
  "/addwalletorganiser",
  protect.protect,
  restrict.restrict("organiser"),
  addwalletorganiserCtrl.addwalletorganiser
);
routes.post(
  "/getorganiser",
  protect.protect,
  restrict.restrict("organiser"),
  getOrganiserCtrl.getOrganiser
);

routes.post(
  "/organiserprofilechange",
  organiserProfilechange.organiserProfilechange
);
module.exports = routes;
