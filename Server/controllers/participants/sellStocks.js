const participantModel = require("../../models/participantModel");
const stockModel = require("../../models/stockModel");
const orderModel = require("../../models/orderModel");

const sellStocks = async (req, res) => {
  try {
    let stockPrice;
    var participantData = await participantModel.participantModel.find({
      contestId: req.body.contestId,
      userId: req.body.userId,
    });

    if (participantData.length === 0) {
      res.status(500).send("Participant not found");
      return;
    }

    participantData = participantData[0];

    var stocksData = await stockModel.stockModel.find({});

    var stocklocation = new Map(),
      participantStocklocation = new Map();
    for (let i = 0; i < stocksData.length; i++) {
      stocklocation.set(stocksData[i].ticker, i);
    }

    for (let i = 0; i < participantData.stocks.length; i++) {
      participantStocklocation.set(participantData.stocks[i].ticker, i);
    }

    for (let i = 0; i < req.body.stocks.length; i++) {
      var item = req.body.stocks[i];

      if (
        !stocklocation.has(item.ticker) ||
        !participantStocklocation.has(item.ticker)
      ) {
        res.status(500).send("Wrong Ticker sent");
        return;
      }

      var stock = stocksData[stocklocation.get(item.ticker)];

      var pstockloc = participantStocklocation.get(item.ticker);
      if (parseInt(item.qty) > participantData.stocks[pstockloc].qty) {
        res.status(500).send("Wrong Quantity");
        return;
      }
      stockPrice = parseFloat(stock.curprice);

      participantData.balance =
        parseFloat(participantData.balance) +
        parseFloat(stock.curprice) * item.qty;

      participantData.stocks[pstockloc].qty -= parseInt(item.qty);
    }
    var newParticipantData = participantModel.participantModel(participantData);
    var updateParticipantdata = await newParticipantData.save();
    let order = orderModel.orderModel({
      participant: participantData._id,
      ticker: req.body.stocks[0].ticker,
      qty: parseInt(req.body.stocks[0].qty),
      transactiontype: "SELL",
      status: "Completed",
      required_price: stockPrice,
    });
    let orderData = order.save();
    console.log(orderData);
    res.status(200).send("Sold Stocks Successfully");
    return;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sellStocks };
