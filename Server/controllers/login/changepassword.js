const organiserModelCtrl = require("../../models/organiserModel");
const userModelCtrl = require("../../models/userModel");
const bcrypt = require("bcrypt");
const changePassword = async (req, res) => {
  try {
    if (req.body.type === "organiser") {
       
      var organiser = await organiserModelCtrl.organiserModel.find({
        _id: req.body.id,
      });
      
      if (organiser.length > 0) {
        
        organiser = organiser[0];
        bcrypt.hash(req.body.changePassword, 10, async function (err, hash) {
          organiser.password = hash;
          var newOrganiser = organiserModelCtrl.organiserModel(organiser);
          await newOrganiser.save();
        });
      } else {
        res.status(500).send("Organiser not found");
        return;
      }
    } else {
      var user = await userModelCtrl.userModel.find({
        _id: req.body.id,
      });
      if (user.length > 0) {
        user = user[0];
        bcrypt.hash(req.body.changePassword, 10, async function (err, hash) {
          if(err){
            console.log(err);
          }
          user.password = hash;
          console.log(hash);
          var newuser = userModelCtrl.userModel(user);
          await newuser.save();
          res.send("Password updated successfully")
        });
      } else {
        res.status(500).send("User not found");
        return;
      }
    }
  } catch (e) {
    console.log(e);
    res.send("Error");
  }
};
module.exports = {
  changePassword,
};
