const mongoose = require("../../models/conn").mongoose;
const participantModel = require("../../models/participantModel");
const orderModel = require("../../models/orderModel");
const stockModel = require("../../models/stockModel");

const participantPortfolio = async (req, res) => {
  try {
    var participantData = await participantModel.participantModel.find({
      contestId: req.body.contestId,
      userId: req.body.userId,
    });
    if (participantData.length === 0) {
      res.status(500).send("Participant not found");
      return;
    }
    participantData = participantData[0];
    let stockMap = new Map();
    let stocksArr = [];
    //storing indexes to find stocks faster
    for (let i = 0; i < participantData.stocks.length; i++) {
      stockMap.set(participantData.stocks[i].ticker, participantData.stocks[i]);
      stocksArr.push(participantData.stocks[i].ticker);
    }
    let stocksData = await stockModel.stockModel.find({
      ticker: { $in: stocksArr },
    });
    let updatedStocksData = [];
    for (let i = 0; i < stocksData.length; i++) {
      let stock = stocksData[i];
      let ticker = stock.ticker;
      var portfoliostock = stockMap.get(ticker);
      let newstock = {
        _id: stock._id,
        ticker: stock.ticker,
        qty: portfoliostock.qty,
        buyprice: portfoliostock.buyprice,
        img: stock.img,
        name: stock.name,
        curprice: stock.curprice,
      };
      updatedStocksData.push(newstock);
    }

    res.send(updatedStocksData);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { participantPortfolio };
