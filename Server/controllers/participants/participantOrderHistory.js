const mongoose = require("../../models/conn").mongoose;
const participantModel = require("../../models/participantModel");
const orderModel = require("../../models/orderModel");

const participantOrderHistory = async (req, res) => {
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
    let ordersHistory = await orderModel.orderModel.aggregate([
      [
        {
          $match: {
            participant: participantData._id,
          },
        },
        {
          $lookup: {
            from: "stocks",
            localField: "ticker",
            foreignField: "ticker",
            as: "ticker",
          },
        },
        {
          $unwind: {
            path: "$ticker",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ],
    ]);
    res.send(ordersHistory);
  } catch (err) {
    res.status(500).send(err);
  }
};
module.exports = { participantOrderHistory };
