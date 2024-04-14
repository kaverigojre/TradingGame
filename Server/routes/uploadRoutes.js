const express = require("express");
let routes = express.Router();
const uploadCtrl = require("../controllers/upload/upload.js");

routes.post("/uploadimg",uploadCtrl.uploadHandler);
module.exports = routes;
