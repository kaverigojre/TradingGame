const express = require("express");
let routes = express.Router();
const userCtrl=require("../controllers/admin/user");
const organiserCtrl=require("../controllers/admin/organiser");
const contestCtrl=require("../controllers/admin/contest");


routes.post("/getUsers",userCtrl.getUsers);
routes.post("/removeUser",userCtrl.removeUser);
routes.post("/getOrganisers",organiserCtrl.getOrganisers);
routes.post("/removeOrganiser",organiserCtrl.removeOrganiser);
routes.post("/getContests",contestCtrl.getContests);
routes.post("/removeContest",contestCtrl.removeContest);
routes.post("/chartOrganiser",contestCtrl.chart);
routes.post("/lineChart",contestCtrl.lineChart);
routes.post("/pieChart",contestCtrl.pieChart);
module.exports = routes;
