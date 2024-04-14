const mongoose = require("../../models/conn").mongoose;
const participantModel = require("../../models/participantModel");
const orderModel = require("../../models/orderModel");

const modifyParticipantStockData = async (order, tickerprice) => {
  const session = await mongoose.startSession(); // Start Transaction Session
  session.startTransaction(); //Start Transaction
  try {
    // get participant data
    var participantData = await participantModel.participantModel.find(
      {
        _id: order.participant,
      },
      null,
      session
    );
    if (participantData.length === 0) {
      await session.abortTransaction(); // Abort Transaction
      session.endSession(); // End Transaction Session
      return;
    }
    participantData = participantData[0];

    var participantStocklocation = new Map(); // storing indexes of tickers in participant stock data so that we can update ticker data faster.

    for (let i = 0; i < participantData.stocks.length; i++) {
      participantStocklocation.set(participantData.stocks[i].ticker, i);
    }

    order.status = "Completed"; // Mark Order Completed at this point

    //If order type is BUY
    if (order.transactiontype == "BUY") {
      // check if participant already has the stock or not.
      if (participantStocklocation.has(order.ticker)) {
        var pstockloc = parseFloat(participantStocklocation.get(order.ticker)); // holds tickers location in participantt stodck data
        var oldprice = parseFloat(participantData.stocks[pstockloc].buyprice);
        var oldqty = parseFloat(participantData.stocks[pstockloc].qty);

        // making the buy price avg according to new and old qty and price
        participantData.stocks[pstockloc].buyprice =
          (oldprice * oldqty + parseFloat(tickerprice) * order.qty) /
          (order.qty + oldqty);

        participantData.stocks[pstockloc].qty += order.qty; // updating participant stock data
      } else {
        // if participant does not have stock make new entry
        participantData.stocks.push({
          ticker: order.ticker,
          name: "",
          buyprice: tickerprice,
          qty: order.qty,
        });
      }

      // order price can be more than actual price so the extra money should be refunded.
      refundprice = (order.required_price - tickerprice) * order.qty;
      participantData.balance =
        parseFloat(participantData.balance) + refundprice;
    } else {
      // If Order type is SELL

      //Check whether participant has stock or not.
      if (participantStocklocation.has(order.ticker)) {
        var pstockloc = participantStocklocation.get(order.ticker);

        //check if quantity is greater or atleast equal to order quantity
        if (parseInt(order.qty) > participantData.stocks[pstockloc].qty) {
          console.log("Invalid Quantity", order._id);
          order.status = "Rejected"; // make order Rejected
        } else {
          // update participantData
          participantData.balance =
            parseFloat(participantData.balance) +
            parseFloat(tickerprice) * order.qty;

          participantData.stocks[pstockloc].qty -= parseInt(order.qty);
        }
      } else {
        console.log("Participant has no Stocks");
        order.status = "Rejected"; // make order Rejected
      }
    }

    // Update values in DB
    var newParticipantData = participantModel.participantModel(participantData);
    newParticipantData = await newParticipantData.save({ session });
    var updatedorder = orderModel.orderModel(order);
    updatedorder = await updatedorder.save({ session });
    await session.commitTransaction(); // Abort Transaction
    session.endSession(); // End Transaction Session
    return;
  } catch (err) {
    await session.abortTransaction(); // Abort Transaction
    session.endSession(); // End Transaction Session
    console.log(err);
    return;
  }
};

const updateOrder = async (ticker, tickerprice) => {
  try {
    // Find orders with same ticker, status:pending  and meet the price condition
    var orders = await orderModel.orderModel.find({
      $and: [
        { ticker: ticker },
        { status: "Pending" },
        {
          $or: [
            {
              $and: [
                { required_price: { $gte: tickerprice } },
                { transactiontype: "BUY" },
              ],
            },
            {
              $and: [
                { required_price: { $lte: tickerprice } },
                { transactiontype: "SELL" },
              ],
            },
          ],
        },
      ],
    });

    // Modigfy Participant's stockdata and balance according to current price
    if (orders.length > 0) {
      for (let i = 0; i < orders.length; i++) {
        await modifyParticipantStockData(orders[i], tickerprice);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { updateOrder };
