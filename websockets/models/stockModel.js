const mongoose = require("./conn.js").mongoose;
const db = require("./conn.js").db;
const stockSchema = mongoose.Schema({
  ticker: {
    type: String,
    unique: true,
    required: [true, "Stock must have a unique ticker"],
  },
  name: {
    type: String,
    required: [true, "Stock must have a name"],
  },
  curprice: {
    type: mongoose.Types.Decimal128,
  },
  img: {
    type: String,
  },
  updated_at: { type: Date },
});
// stockSchema.pre("save", function (next) {
//   this.updated_at = Date.now();
//   next();
// });
let stockModel = mongoose.model("Stock", stockSchema);

module.exports = { stockModel };
