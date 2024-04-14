const userModelCtrl = require("../../models/userModel");

const addwalletUser = async (req, res) => {
  var user = await userModelCtrl.userModel.find({
    _id: req.body.id,
  });

  if (user.length > 0) {
    user = user[0];
    price = parseFloat(req.body.price);
    if (price > 0) {
      user.wallet = parseFloat(user.wallet) + price;
      var newuser = userModelCtrl.userModel(user);
      await newuser.save();
      res.status(200).send("Added Successfully");
    } else {
      res.status(500).send("Invalid price");
    }
  } else {
    res.status(500).send("user not found");
  }
};

module.exports = { addwalletUser };
