const participantModel = require("../../models/participantModel");
const contestModel = require("../../models/contestModel");

let contestParticipantDetails = async (req, res) => {
  try {
    const contest = await contestModel.contestModel.find({
      _id: req.body.contestId,
    }).populate({
      path:"organisedBy",
      select:{"name":1}
    });
    let participant = await participantModel.participantModel.find({
      contestId: req.body.contestId,
      userId: req.body.userId,
    });
    if (!contest) {
      res.status(500).send("Contest not found");
    }
    // if (contest && participant) {
    let data = {
      contest: contest[0],
      participant: participant[0],
    };
    res.send(data);
    // }
  } catch (err) {
    res.status(500).send("INTERNAL SERVER ERROR");
  }
};

module.exports = { contestParticipantDetails };
