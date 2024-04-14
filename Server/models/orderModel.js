const mongoose = require("./conn.js").mongoose;
const db = require("./conn.js").db;
const orderSchema = mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participant",
    required: [true, "Order must have a participant"],
  },
  ticker: {
    type: String,
    required: [true, "Stock must have a unique ticker"],
  },
  qty: {
    type: Number,
    required: [true, "Order must have a Quantity"],
  },
  transactiontype: {
    type: String,
    enum: ["BUY", "SELL"],
    required: [true, "Order must have a transactiontype"],
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Rejected", "Cancelled", "Squared-Off"],
    default: "Pending",
  },
  required_price: {
    type: mongoose.Types.Decimal128,
    required: [true, "Order must have a price"],
  },
  updated_at: { type: Date },
});
orderSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});
let orderModel = mongoose.model("Order", orderSchema);

module.exports = { orderModel };
