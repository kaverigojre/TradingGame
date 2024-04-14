const mongoose = require("./conn.js").mongoose;
const db = require("./conn.js").db;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
  },
  img:{
    type:String,
    default:"./img/1.jpg"
  },
  password: {
    type: String,
    required:[true,"User must have a password"]
  },
  email: {
    type: String,
    required: [true, "User must have a email"],
    unique: true,
  },
  wallet: {
    type: mongoose.Types.Decimal128,
    default:0
  },
  contest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
    },
  ],
  emailToken:{
   type:String
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  updated_at: { type: Date },
});

userSchema.pre("save", function(next){
  this.updated_at = Date.now();
  next();
});
let userModel = mongoose.model("User", userSchema);
module.exports = { userModel };
