const mongoose = require("../../models/conn").mongoose;
const participantModel = require("../../models/participantModel");
const orderModel = require("../../models/orderModel");

let cancelOrder = async (req, res) => {
  try {
    let orderId = req.body.id;
    let order = await orderModel.orderModel.find({ _id: orderId });
    if (!order) {
      res.status(500).send("Order not found");
      return;
    }
    order = order[0];
    if (order.status !== "Pending") {
      res.status(500).send("Order Already Processed");
      return;
    }
    let participant = await participantModel.participantModel.find({
      _id: order.participant,
    });
    participant = participant[0];
    console.log(participant);
    let moneyRequired = order.qty * parseFloat(order.required_price);
    console.log(moneyRequired);
    if (order.transactiontype === "BUY") {
      participant.balance = parseFloat(participant.balance) + moneyRequired;
      participant = participantModel.participantModel(participant);
      let updatedParticipant = await participant.save();
    }
    order.status = "Cancelled";
    order = orderModel.orderModel(order);
    let updatedorder = await order.save();
    res.send(updatedorder);
  } catch (err) {
    console.log(err);
    res.status(500).send("INTERNAL SERVER ERROR");
  }
};

module.exports = { cancelOrder };
