const participantModelCtrl = require("../../models/participantModel");
// const mongoose = require("mongoose");
//import { ObjectId } from "bson"
const mongodb = require("mongodb");

const leaderBoard = async (req, res) => {
  // console.log(req.body.contestId);
  // const contestId = '' + req.body.contestId;
  // console.log(typeof contestId);

  const pipeline = [
    {
      $match: {
        contestId: new mongodb.ObjectId(req.body.contestId),
      },
    },
    {
      $set: {
        stockBalance: {
          $reduce: {
            input: {
              $ifNull: ["$stocks", []],
            },
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                {
                  $multiply: ["$$this.qty", "$$this.buyprice"],
                },
              ],
            },
          },
        },
      },
    },

    {
      $set: {
        totalBalance: {
          $add: ["$stockBalance", "$balance"],
        },
      },
    },
    {
      $project: {
        balance: 1,
        stockBalance: 1,
        totalBalance: 1,
        updated_at: 1,
        userId: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user_information",
      },
    },

    {
      $sort: {
        totalBalance: -1,
        updated_at: 1,
      },
    },
  ];

  try{
  let participants = await participantModelCtrl.participantModel.aggregate(
    pipeline
  );

  var data = [];
  for (var i = 0; i < participants.length; i++) {
    totalBalance = parseFloat(participants[i].totalBalance);
    totalBalance = Math.round((totalBalance + Number.EPSILON) * 100) / 100;
    const obj = {
      name: participants[i].user_information[0].name,
      img: participants[i].user_information[0].img,
      totalBalance: totalBalance,
    };
    data.push(obj);
  }
  console.log(data);
  res.send(data);
}
catch(e){
  res.status(500).send("Error");
}
};
module.exports = { leaderBoard };
