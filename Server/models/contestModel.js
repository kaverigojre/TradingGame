const mongoose = require("./conn.js").mongoose;
const db = require("./conn.js").db;

const contestSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Stock must have a unique ticker"],
    },
    organisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organiser",
    },
    fees: {
      type: Number,
      required: true,
    },
    prize: {
      type: Number,
      required: true,
    },
  
    startTime: {
      type: Date,
      default: Date.now(),
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Completed", "Deleted"],
      default: "Pending",
    },
    balance: {
      type: mongoose.Types.Decimal128,
      required: [true, "A contest must have a balance"],
    },
    participant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// contestSchema.pre("save", function (next) {
//   this.updated_at = Date.now();
//   next();
// });
let contestModel = mongoose.model("Contest", contestSchema);
module.exports = { contestModel };
