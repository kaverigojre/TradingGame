const express = require("express");
let routes = express.Router();
const getStocksCtrl=require("../controllers/stocks/getStocks");

routes.get("/",getStocksCtrl.getStocks);
module.exports = routes;
