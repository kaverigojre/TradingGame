const participantModel = require("../../models/participantModel");
const stockModel = require("../../models/stockModel");

let participantStocks = async (req, res) => {
  var participantData = await participantModel.participantModel.find({
    contestId: req.body.contestId,
    userId: req.body.userId,
  });
  if (participantData.length === 0) {
    res.status(500).send("Participant not found");
    return;
  }
  participantData = participantData[0];
  console.log(participantData.stocks);
  res.send(participantData.stocks);
};

module.exports = { participantStocks };
