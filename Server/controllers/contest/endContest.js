const contestModel = require("../../models/contestModel");
const participantModel = require("../../models/participantModel");
const userModel = require("../../models/userModel");
const stockModel = require("../../models/stockModel");
const orderModel = require("../../models/orderModel");
const { default: mongoose } = require("mongoose");
let squareOff = async (participant) => {
  let stockData = participant.stocks;
  let totalMoney = 0;
  console.log("------------------------------------------------------------");
  console.log("Starting monmey", totalMoney);
  for (let i = 0; i < stockData.length; i++) {
    let stock = stockData[i];
    let curstock = await stockModel.stockModel.find({ ticker: stock.ticker });
    curstock = curstock[0];
    let curprice = parseFloat(curstock.curprice);
    totalMoney += stock.qty * curprice;
    if (stock.qty > 0) {
      let order = new orderModel.orderModel({
        participant: participant._id,
        ticker: stock.ticker,
        qty: stock.qty,
        transactiontype: "SELL",
        status: "Squared-Off",
        required_price: curprice,
      });
      order = order.save();
    }
    // participant.stocks[i].qty = 0;
    // participant.stocks[i].qty=0;
    // console.log("STOCK", i, stock);
    // console.log("Total Money", i, totalMoney);
    // console.log(curstock.ticker, stock.qty, curprice);
  }
  participant.balance += totalMoney;
  participant.stocks = [];
  let newParticipant = new participantModel.participantModel(participant);
  let updatedParticipant = await newParticipant.save();
  console.log(updatedParticipant);
  console.log("Total money: " + totalMoney);
};
const cancelOrders = async (contestId) => {
  let orders = await orderModel.orderModel.aggregate([
    {
      $lookup: {
        from: "participants",
        localField: "participant",
        foreignField: "_id",
        as: "participant",
      },
    },
    {
      $unwind: {
        path: "$participant",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "participant.contestId": mongoose.Types.ObjectId(contestId),
        status: "Pending",
      },
    },
  ]);
  console.log("ORDERS:::::::::::::::::::::::::::", orders);
  for (let i = 0; i < orders.length; i++) {
    let order = orders[i];
    order.status = "Rejected";
    if (order.transactiontype == "BUY") {
      let participant = await participantModel.participantModel.findById(
        order.participant._id
      );
      participant.balance =
        parseFloat(participant.balance) +
        order.qty * parseFloat(order.required_price);
      participant = new participantModel.participantModel(participant);
      let updatedParticipant = await participant.save();
    }

    // order =  orderModel.orderModel(order);
    let updatedOrder = await orderModel.orderModel.updateOne(
      { _id: order._id },
      { $set: { status: "Rejected" } }
    );
    console.log(updatedOrder);
  }
  console.log("OUTSIDE");
};
let endContest = async (id) => {
  try {
    let curtime = Date.now();
    console.log("Starting:::::::::::::::::: ", curtime);
    // let id = .id;
    const contestData = await contestModel.contestModel.findById(id);
    contestData.status = "Completed";
    let participants = await participantModel.participantModel.find({
      contestId: id,
    });
    for (let i = 0; i < participants.length; i++) {
      // console.log(participant);
      squareOff(participants[i]);
      //   console.log("----------------------------------------");
    }
    cancelOrders(id);
    console.log("Ending:::::::::::::::::: ", Date.now() - curtime);
    res.send(participants);
  } catch (error) {}
};

module.exports = { endContest };
