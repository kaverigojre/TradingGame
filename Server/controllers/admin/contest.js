const contestModelCtrl = require("../../models/contestModel");
const getContests=async(req,res)=>{
    const  contests=await contestModelCtrl.contestModel.find({}).populate("organisedBy");
    return res.send(contests);
  }
  const removeContest=async(req,res)=>{
   
    const removeContest=await contestModelCtrl.contestModel.deleteOne( { _id:req.body.id } );
    return res.status(200).send("succesfully removed a contest");
  }
  const chart=async(req,res)=>{
    const pipeline=[
      {
        '$group': {

          '_id': '$organisedBy', 
          'count': {
            '$count': {}
          }
        }
      },
      {
        
        
          '$set': {
            'new':'$_id'
          }
      

      },
      {
        '$lookup': {
          'from': "organisers",
          'localField': "new",
          'foreignField': "_id",
          'as': "organiser_information"
      }
      },
    ];
    const chart=await contestModelCtrl.contestModel.aggregate(pipeline);
    
    const array=[];
    for(let i=0;i<chart.length;i++)
    {
      const sub_array=[];
       sub_array.push(chart[i].organiser_information[0].name);
       sub_array.push(chart[i].count);
      array.push(sub_array);
    }
     return res.send(array);
  }
  const lineChart=async(req,res)=>{
    const pipeline=[
      {
        '$group': {
          '_id': {
            '$dateToString': {
              'format': '%d', 
              'date': '$startTime'
            }
          }, 
          'count': {
            '$count': {}
          }
        }
      }, {
        '$sort': {
          '_id': 1
        }
      }
    ];
    const line= await contestModelCtrl.contestModel.aggregate(pipeline);
    return res.send(line);

  }
  const pieChart=async(req,res)=>{
    const pipeline=[
      {
        '$group': {
          '_id': '$status',
          'count': {
            '$count': {}
          }

          }, 
          
      }
      
    ];
    const result= await contestModelCtrl.contestModel.aggregate(pipeline);
    return res.send(result);

  }
  module.exports={getContests,removeContest,chart,lineChart,pieChart};