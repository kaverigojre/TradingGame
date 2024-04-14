const userModelCtrl = require("../../models/userModel");

const getUsers=async(req,res)=>{
    const  users=await userModelCtrl.userModel.find({});
    return res.send(users);
  }
  const removeUser=async(req,res)=>{
   
    const removeUser=await userModelCtrl.userModel.deleteOne( { _id:req.body.id } );
    return res.status(200).send("succesfully removed a user");
  }
  module.exports={getUsers,removeUser};