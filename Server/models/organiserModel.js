const mongoose = require("./conn.js").mongoose;
const db = require("./conn.js").db;
const organiserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Organiser must have a name"],
  },
  password: {
    type: String,
    required: [true, "Organiser must have a password"],
  },
  img: {
    type: String,
    default: "./img/1.jpg",
  },
  email: {
    type: String,
    required: [true, "Organiser must have an email"],
    unique: true,
  },
  wallet: {
    type: mongoose.Types.Decimal128,
    default: 0,
  },
  contest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
    },
  ],
  updated_at: { type: Date },
});
organiserSchema.pre("save", function(next){
  this.updated_at = Date.now();
  next();
});
let organiserModel = mongoose.model("Organiser", organiserSchema);

module.exports = { organiserModel };
