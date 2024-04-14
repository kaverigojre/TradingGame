const mongoose = require("../../models/conn").mongoose;
const participantModel = require("../../models/participantModel");
const stockModel = require("../../models/stockModel");
const orderModel = require("../../models/orderModel");
const backendurl = "http://localhost:3000/"; //"https://api.tradebattle.in/";
const putOrder = async (req, res) => {
  var stock = await stockModel.stockModel.find({
    ticker: req.body.stocks[0].ticker,
  });
  if (stock.length <= 0) {
    res.status(500).send("Invalid Ticker");
    return;
  }

  if (
    req.body.transactiontype == "BUY" &&
    req.body.required_price >= stock[0].curprice
  ) {
    console.log(req.body);
    res.redirect(307, backendurl + "participate/buystocks");
    return;
  }
  if (
    req.body.transactiontype == "SELL" &&
    req.body.required_price <= stock[0].curprice
  ) {
    res.redirect(307, backendurl + "participate/sellstocks");
    return;
  }

  const session = await mongoose.startSession(); // Start Transaction Session
  session.startTransaction(); //Start Transaction
  try {
    // Find Participant
    var participantData = await participantModel.participantModel.find(
      {
        contestId: req.body.contestId,
        userId: req.body.userId,
      },
      null,
      { session }
    );

    if (participantData.length === 0) {
      await session.abortTransaction(); // Abort Transaction
      session.endSession(); // End Transaction Session

      res.status(500).send("Participant not found");
      return;
    }
    participantData = participantData[0];

    var order = {
      participant: participantData._id,
      ticker: req.body.stocks[0].ticker,
      qty: req.body.stocks[0].qty,
      transactiontype: req.body.transactiontype,
      required_price: req.body.required_price,
      status: "Pending",
    };

    if (order.transactiontype == "BUY") {
      var participantbalance = parseFloat(participantData.balance);
      if (participantbalance < order.qty * order.required_price) {
        //Check if participant has enough balance or not
        await session.abortTransaction(); //Commit transaction
        session.endSession(); //end session
        res.status(500).send("Not Enough Balance");
        return;
      }

      //Update Balance
      participantData.balance =
        participantbalance - order.qty * order.required_price;

      var updateParticipantdata =
        participantModel.participantModel(participantData);
      updateParticipantdata = await updateParticipantdata.save({ session }); //Save participant Data in DB
    }
    var updateorder = orderModel.orderModel(order);

    updateorder = await updateorder.save({ session }); // Save order Data in DB
console.log("updatedorder",updateorder);
    await session.commitTransaction(); // Commit Transaction
    session.endSession(); // End Session
    res.status(200).send("Added Order Successfully");
  } catch (err) {
    await session.abortTransaction(); // Stop Transaction
    session.endSession(); // Stop Session
    console.log(err);
  }
};

module.exports = { putOrder };
