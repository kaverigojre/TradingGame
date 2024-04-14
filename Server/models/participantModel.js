const mongoose = require("./conn.js").mongoose;
const db = require("./conn.js").db;

const participantSchema = mongoose.Schema({
 contestId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Contest"
 },
 userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
 },
 balance:{
    type:mongoose.Types.Decimal128,
    default:100000
 },
 stocks:[{
   ticker:{
      type:String,
      required:true,
   },
    name:{
        type:String,
    },
    buyprice:{
        type:mongoose.Types.Decimal128,
        required:true
    },
    qty:{
        type:Number,
        required:true
    }
 }],
  updated_at: { type: Date },
});
participantSchema.pre("save", function(next){
  this.updated_at = Date.now();
  next();
});
let participantModel = mongoose.model("Participant", participantSchema);

module.exports = { participantModel };
