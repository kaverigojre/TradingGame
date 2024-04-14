const userModelCtrl = require("../../models/userModel");

const getUser = async (req, res) => {
  try {
    console.log(req.params.id);
    let data = await userModelCtrl.userModel
      .find({ _id: req.params.id })
      .select("name email wallet contest img");
      res.send(data);
  } catch (e) {
    res.status(500).send("INTERNAL ERROR");
  }
};

module.exports ={getUser}
