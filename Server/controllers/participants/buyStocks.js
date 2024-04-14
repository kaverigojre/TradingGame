const participantModel = require("../../models/participantModel");
const stockModel = require("../../models/stockModel");
const orderModel = require("../../models/orderModel");

const buyStocks = async (req, res) => {
  try {
    console.log(req.body);
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

    //storing indexes to find stocks faster
    for (let i = 0; i < stocksData.length; i++) {
      stocklocation.set(stocksData[i].ticker, i);
    }
    //storing indexes to find participantstocks faster
    for (let i = 0; i < participantData.stocks.length; i++) {
      participantStocklocation.set(participantData.stocks[i].ticker, i);
    }
    for (let i = 0; i < req.body.stocks.length; i++) {
      var item = req.body.stocks[i];
      item.qty = parseInt(item.qty);

      if (!stocklocation.has(item.ticker)) {
        res.status(500).send("Wrong Ticker sent");
        return;
      }
      var stock = stocksData[stocklocation.get(item.ticker)];

      participantData.balance =
        parseFloat(participantData.balance) -
        parseFloat(stock.curprice) * item.qty;

      if (participantData.balance < 0) {
        res.status(500).send("Insufficient Balance");
        return;
      }
      if (participantStocklocation.has(item.ticker)) {
        var pstockloc = parseFloat(participantStocklocation.get(item.ticker));
        var oldprice = parseFloat(participantData.stocks[pstockloc].buyprice);
        var oldqty = parseFloat(participantData.stocks[pstockloc].qty);

        participantData.stocks[pstockloc].buyprice =
          (oldprice * oldqty + parseFloat(stock.curprice) * item.qty) /
          (item.qty + oldqty);
        participantData.stocks[pstockloc].qty += item.qty;
      } else {
        participantData.stocks.push({
          ticker: item.ticker,
          name: "",
          buyprice: stock.curprice,
          qty: item.qty,
        });
      }
      stockPrice=stock.curprice;
    }
    var newParticipantData = participantModel.participantModel(participantData);
    var updateParticipantdata = await newParticipantData.save();
    let order = orderModel.orderModel({
      participant: participantData._id,
      ticker: req.body.stocks[0].ticker,
      qty: parseInt(req.body.stocks[0].qty),
      transactiontype: "BUY",
      status: "Completed",
      required_price: stockPrice,
    });
    let orderData = order.save();
    console.log(orderData);
    res.status(200).send("Purchased Stocks Successfully");
    return;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { buyStocks };
