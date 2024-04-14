const express = require("express");
let routes = express.Router();
const contestCtrl = require("../controllers/contest/createContest");
const deletecontestCtrl = require("../controllers/contest/deleteContest");
const getContestsCtrl = require("../controllers/contest/getContests");
const endContestCtrl = require("../controllers/contest/endContest");
const leaderBoardCtrl = require("../controllers/contest/leaderBoard");
const getUsercontestsCtrl = require("../controllers/contest/getUsercontests");
const getOrganisercontestsCtrl = require("../controllers/contest/getorganisercontests");
const getContestParticipantsCtrl = require("../controllers/contest/getContestParticipantDetails");
const protect = require("../controllers/auth/protect");
const restrict = require("../controllers/auth/restrict");
routes.post(
  "/create",
  protect.protect,
  restrict.restrict("organiser"),
  contestCtrl.createContest
);
routes.post(
  "/delete",
  protect.protect,
  restrict.restrict("organiser", "admin"),
  deletecontestCtrl.deleteContest
);
routes.post("/end", endContestCtrl.endContest);
routes.post("/leaderboard", leaderBoardCtrl.leaderBoard);
routes.get("/getcontests", getContestsCtrl.getContests);
routes.post("/getusercontests", getUsercontestsCtrl.getUsercontests);
routes.post("/getusercontests2", getUsercontestsCtrl.getUsercontests2);
routes.post(
  "/getorganisercontests",
  protect.protect,
  restrict.restrict("organiser"),
  getOrganisercontestsCtrl.getOrganisercontests
);
routes.post(
  "/getContestParticipant",
  getContestParticipantsCtrl.contestParticipantDetails
);
module.exports = routes;
