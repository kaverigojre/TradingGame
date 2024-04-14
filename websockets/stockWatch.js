const express = require("express");
const app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json());
const stockModelCtrl = require("./models/stockModel");

const { Server } = require("socket.io");

const io = new Server(3007, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.emit("connection", "hello from server");
  stockModelCtrl.stockModel.watch().on("change", (data) => {
    console.log(data.operationType);
    console.log(data.updateDescription.updatedFields.curprice);
    if (
      data.operationType === "update" &&
      data.updateDescription.updatedFields.curprice
    ) {
      // console.log("Hello");
      let obj = {
        stock: data.documentKey._id,
        price: data.updateDescription.updatedFields.curprice,
      };
      socket.broadcast.emit("priceChange", obj);
    }
  });

  socket.on("newUser", function (msg) {
    console.log(msg);
  });
});
