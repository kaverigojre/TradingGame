const participantModel = require("../../models/participantModel");
const { default: mongoose } = require("mongoose");

let userAnalysis = async (req, res) => {
  let pipeline = [
    {
      $match: {
        userId: mongoose.Types.ObjectId(req.body.userId),
      },
    },
    {
      $lookup: {
        from: "contests",
        localField: "contestId",
        foreignField: "_id",
        as: "contestId",
      },
    },
    {
      $unwind: {
        path: "$contestId",
      },
    },
    {
      $facet: {
        barchart: [
          {
            $group: {
              _id: {
                year: {
                  $year: "$contestId.startTime",
                },
                month: {
                  $month: "$contestId.startTime",
                },
              },
              contests: {
                $sum: 1,
              },
            },
          },
        ],
        linechart: [
          {
            $group: {
              _id: "$_id",
              contests: {
                $push: {
                  name: "$contestId.name",
                  startBalance: "$contestId.balance",
                  endBalance: "$balance",
                },
              },
            },
          },
        ],
      },
    },
  ];
  let data = await participantModel.participantModel.aggregate(pipeline);
  data=data[0];
  let barchartlabels=[],barchartdata = [];
  for(let i=0; i<data.barchart.length; i++){
    barchartlabels.push(data.barchart[i]._id.month+"/"+data.barchart[i]._id.year);
    barchartdata.push(data.barchart[i].contests)
  }
  barchartlabels=barchartlabels.reverse();
  barchartdata=barchartdata.reverse();
  let linechartlabels = [],linechartdata1=[],linechartdata2=[];
  for(let i=0;i<data.linechart.length;i++){
    linechartlabels.push(data.linechart[i].contests[0].name);
    linechartdata1.push(parseFloat(data.linechart[i].contests[0].startBalance));
    linechartdata2.push(parseFloat(data.linechart[i].contests[0].endBalance));
  }
  let chartData={
    barchart:{
        barchartlabels,barchartdata
    },
    linechart:{
        linechartlabels,linechartdata1,linechartdata2
    }
  }
//   res.send(data);
  res.send(chartData);
};

module.exports={userAnalysis};