const contestModel = require("../../models/contestModel");
const organiserModel = require("../../models/organiserModel");
const contestSchedule = require("./contestSchedule");

let createContest = async (req, res) => {
  try {
    let organiser = await organiserModel.organiserModel.find({
      _id: req.body.organisedBy,
    });
    if (organiser.length === 0) {
      console.log(1);
      res.status(500).send("Organiser not found");
      return;
    }
    organiser = organiser[0];
    let wallet = parseFloat(organiser.wallet);
    if (wallet < req.body.prize) {
       console.log(2);
      res.status(500).send("Not enough funds");
      return;
    }
    if (!req.body.startTime) {
      req.body.startTime = Date.now();
      req.body.status = "Active";
    } else {
      req.body.status = "Pending";
    }
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    if (isNaN(startTime) || isNaN(endTime)) {
       console.log(3);
      res.status(500).send("Invalid Time Provided");

      return;
    }
    if (
      startTime.getTime() + 10 < Date.now() ||
      startTime.getTime() > endTime.getTime()
    ) {
       console.log(4);
      res.status(500).send("Invalid Start Time");
      return;
    }
    let contest = contestModel.contestModel({
      name: req.body.name,
      organisedBy: req.body.organisedBy,
      fees: req.body.fees,
      prize: req.body.prize,
      balance: req.body.balance,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      status: req.body.status,
      participant: [],
    });
    let contestdata = await contest.save();
    wallet -= req.body.prize;
    organiser.wallet = wallet;
    organiser.contest.push(contestdata._id);
    let updatedOrganiser = await organiser.save();
    contestSchedule.scheduleJobs(
      contestdata._id,
      contestdata.startTime,
      contestdata.endTime
    );
    res.send(updatedOrganiser);
  } catch (err) {
     console.log(err);
    res.status(500).send(err);
  }
};

module.exports = { createContest };
