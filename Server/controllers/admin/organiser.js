const organiserModelCtrl = require("../../models/organiserModel");
const getOrganisers=async(req,res)=>{
    const  organisers=await organiserModelCtrl.organiserModel.find({});
    return res.send(organisers);
  }
  const removeOrganiser=async(req,res)=>{
   
    const removeOrganiser=await organiserModelCtrl.organiserModel.deleteOne( { _id:req.body.id } );
    return res.status(200).send("succesfully removed a Organiser");
  }
  
  module.exports={getOrganisers,removeOrganiser};