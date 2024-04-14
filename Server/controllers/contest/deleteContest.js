const contestModel = require("../../models/contestModel");
const participantModel = require("../../models/participantModel");
const userModel = require("../../models/userModel");

const updateWallet = async (userId, fees) => {
  try {
    let data = await userModel.userModel.updateOne(
      { _id: userId },
      { $inc: { wallet: fees } }
    );
    console.log(userId + " wallet updated");
  } catch (err) {
    console.log("Wallet update failed");
  }
};
const deleteContest = async (req, res) => {
  try{
  let contest = await contestModel.contestModel.find({ _id: req.body.id });
  //   console.log("CONTEST:::::::::"+contest);
  if (contest.length === 0) {
    res.status(404).send("Contest not found");
    return;
  }
  contest = contest[0];
  if (contest.status !== "Pending") {
    res.status(404).send("Only pending contests can be deleted");
    return;
  }
  contest.status = "Deleted";
  let updatedContest = contestModel.contestModel(contest);
  updatedContest = await updatedContest.save();
  console.log(updatedContest);
  let participantData = await participantModel.participantModel.find({
    contestId: contest._id,
  });
  for (let participant of participantData) {
    updateWallet(participant.userId, contest.fees);
  }
  res.send(contest);
}
catch (err) {
  res.status(500).send("Internal Server Error");
}
};

module.exports = { deleteContest };
