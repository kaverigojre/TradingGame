const organiserModelctrl = require("../../models/organiserModel");
const mongodb = require("mongodb");
const getOrganiser = async (req, res) => {

  const pipeline = [
    {
      $match: {
        _id: new mongodb.ObjectId(req.body.organiserId),
      },
    },
    {
      $lookup: {
        from: "contests",
        localField: "contest",
        foreignField: "_id",
        as: "contest",
      },
    },
    {
      $unwind: {
        path: "$contest",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
        $sort:{
            "contest.startTime":-1
        }
    },
    {
      $addFields: {
        participantscount: {
          $size: "$contest.participant",
        },
        earned: {
          $multiply: [
            "$contest.fees",
            {
              $size: "$contest.participant",
            },
          ],
        },
        spent: "$contest.prize",
        contestname: "$contest.name",
      },
    },
    {
      $project: {
        contestname: 1,
        earned: 1,
        spent: 1,
        participantscount: 1,
        wallet:1,
      },
    },
    {
      $group: {
        _id: "$_id",
       
        barchart: {
          $push: {
            name: "$contestname",
            participantscount: "$participantscount",
          },
        },
        linechart: {
          $push: {
            name: "$contestname",
            spent: "$spent",
            earned: "$earned",
          },
        },
        totalearned: {
          $sum: "$earned",
        },
        totalspent: {
          $sum: "$spent",
        },
        contestscount: {
          $sum: 1,
        },
      },
    },
  ];

  var organiser = await organiserModelctrl.organiserModel.aggregate(pipeline);
  var organiserdata = await organiserModelctrl.organiserModel.find({_id:req.body.organiserId});

  if(organiser.length>0||organiserdata.length>0)
  {
    organiserdata=organiserdata[0];
    
  }
  else{
    res.status(500).send("Invalid Organiser");
    return;
  }

  var  barchartlabels=[],barchartdata=[],linechartlabels=[],linechartdata1=[],linechartdata2=[];
  if(organiser.length>0){
  for(let i=0;i<organiser[0].barchart.length;i++){
    barchartlabels.push(organiser[0].barchart[i].name);
    barchartdata.push(organiser[0].barchart[i].participantscount);
  }
   for (let i = 0; i < organiser[0].linechart.length; i++) {
     linechartlabels.push(organiser[0].linechart[i].name);
     linechartdata1.push(organiser[0].linechart[i].earned);
     linechartdata2.push(organiser[0].linechart[i].spent);
   }
  
  
   var obj = {
     barchartlabels: barchartlabels,
     barchartdata: barchartdata,
     linechartlabels: linechartlabels,
     linechartdata1: linechartdata1,
     linechartdata2: linechartdata2,
     wallet: parseFloat(organiserdata.wallet),
     img: organiserdata.img,
     totalearned: organiser[0].totalearned,
     totalspent: organiser[0].totalspent,
     contestscount: organiser[0].contestscount,
   };
  }
  else{
    var obj = {
      barchartlabels: barchartlabels,
      barchartdata: barchartdata,
      linechartlabels: linechartlabels,
      linechartdata1: linechartdata1,
      linechartdata2: linechartdata2,
      wallet: parseFloat(organiserdata.wallet),
      img: organiserdata.img,
      totalearned: 0,
      totalspent: 0,
      contestscount: 0,
    };
  }

  res.send(obj);
};

module.exports = { getOrganiser };
