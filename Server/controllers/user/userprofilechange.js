const userModelCtrl = require("../../models/userModel");

const userProfilechange = async (req, res) => {
  console.log(req.body);
  var user = await userModelCtrl.userModel.find({
    _id: req.body.id,
  });

  if (user.length > 0) {
    user = user[0];

    user.img = req.body.img;
    var newuser = userModelCtrl.userModel(user);
    await newuser.save();
    res.status(200).send("Added Successfully");
  } else {
    res.status(500).send("user not found");
  }
};
module.exports = {
  userProfilechange,
};
