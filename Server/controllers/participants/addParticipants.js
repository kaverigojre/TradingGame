const participantModel = require("../../models/participantModel");
const contestModel = require("../../models/contestModel");
const userModel = require("../../models/userModel");

const addParticipant = async (req, res) => {
  try {
    console.log(req.body);
    let joinedUser = await participantModel.participantModel.find({
      contestId: req.body.contestId,
      userId: req.body.userId,
    });
    // console.log("joinedUser"+joinedUser);
    if (joinedUser.length !== 0) {
      res.status(500).send("User Already Registered");
      return;
    }
    let contestData = await contestModel.contestModel.find({
      _id: req.body.contestId,
    });
    let userData = await userModel.userModel.find({ _id: req.body.userId });
    if (contestData.length === 0 || userData.length === 0) {
      res.status(500).send("Data not found");
      return;
    }
    contestData = contestData[0];
    userData = userData[0];
    let wallet = parseFloat(userData.wallet);
    if (wallet < contestData.fees) {
      res.status(500).send("Not enough funds");
      return;
    }
    wallet -= contestData.fees;
    userData.wallet = wallet;
    let participant = participantModel.participantModel({
      contestId: req.body.contestId,
      userId: req.body.userId,
      balance: contestData.balance,
      stocks: [],
    });
    let participantData = await participant.save();
    contestData.participant.push(participantData._id);
    userData.contest.push(contestData._id);
    let newContestData = await contestData.save();
    // console.log(newContestData);
    let newUserData = await userData.save();
    // console.log(newUserData);
    res.send(participantData);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getParticipants = async (req, res) => {
  let participants = await participantModel.participantModel.find({});
  res.send(participants);
};

module.exports = { addParticipant, getParticipants };
