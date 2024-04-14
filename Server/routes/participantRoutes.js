const express = require("express");
let routes = express.Router();
const participantCtrl = require("../controllers/participants/addParticipants");
const buyStocksCtrl = require("../controllers/participants/buyStocks");
const sellStocksCtrl = require("../controllers/participants/sellStocks");
const putOrderCtrl = require("../controllers/participants/putOrder");
const participantStock = require("../controllers/participants/participantStock");
const participantOrderHistory = require("../controllers/participants/participantOrderHistory");
const participantPortfoilio = require("../controllers/participants/participantPortfoilio");
const UserAnalysisCtrl = require("../controllers/participants/userAnalysis");
const protect = require("../controllers/auth/protect");
const restrict = require("../controllers/auth/restrict");
routes.post(
  "/add",
  protect.protect,
  restrict.restrict("user"),
  participantCtrl.addParticipant
);
routes.post(
  "/buystocks",
  protect.protect,
  restrict.restrict("user"),
  buyStocksCtrl.buyStocks
);
routes.post(
  "/sellstocks",
  protect.protect,
  restrict.restrict("user"),
  sellStocksCtrl.sellStocks
);
routes.post(
  "/putorder",
  protect.protect,
  restrict.restrict("user"),
  putOrderCtrl.putOrder
);
routes.post(
  "/getstocks",
  protect.protect,
  restrict.restrict("user"),
  participantStock.participantStocks
);
routes.post(
  "/orderHistory",
  protect.protect,
  restrict.restrict("user"),
  participantOrderHistory.participantOrderHistory
);
routes.post(
  "/portfolio",
  protect.protect,
  restrict.restrict("user"),
  participantPortfoilio.participantPortfolio
);
routes.post(
  "/userAnalysis",
  protect.protect,
  restrict.restrict("user"),
  UserAnalysisCtrl.userAnalysis
);
module.exports = routes;
