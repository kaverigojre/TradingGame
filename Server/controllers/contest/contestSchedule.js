const contestModel = require("../../models/contestModel");
const schedule = require("node-schedule");
const endContest = require("./endContest");

const updateContest = async (id, status) => {
  try {
    let contest = await contestModel.contestModel.findById(id);
    if (contest.status !== "Deleted") {
      let data = await contestModel.contestModel.updateOne(
        { _id: id },
        { status: status }
      );
      if (status === "Completed") {
        endContest.endContest(id);
      }
      console.log("CONTEST UPDATE Success", id, data);
    }
  } catch (err) {
    console.log("Error updating contest");
  }
};

var scheduleJobs = (id, startTime, endTime) => {
  console.log("TIMER:", startTime, endTime);
  const StartContest = schedule.scheduleJob(startTime, function () {
    console.log("The world is going to start.!!!!!!!!!!!!!!" + startTime);
    updateContest(id, "Active");
  });
  const EndContest = schedule.scheduleJob(endTime, function () {
    console.log("The world is going to end.!!!!!!!!!!!!!!" + endTime);
    updateContest(id, "Completed");
  });
};
module.exports = { scheduleJobs };
