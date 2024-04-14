const express = require("express");
let routes = express.Router();
const cancelOrderCtrl = require("../controllers/orders/cancelOrder");
const protect = require("../controllers/auth/protect");
const restrict = require("../controllers/auth/restrict");
routes.post("/cancel", protect.protect,
restrict.restrict("user","admin"), cancelOrderCtrl.cancelOrder);
module.exports = routes;
