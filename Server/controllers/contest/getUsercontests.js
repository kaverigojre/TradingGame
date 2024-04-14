const userModelctrl = require("../../models/userModel");
const contestModel = require("../../models/contestModel");

const getUsercontests = async (req, res) => {
  try {
    const usercontests = await userModelctrl.userModel.find(
      {
        _id: req.body._id,
      },
      { contest: 1, _id: 0 }
    );
    if (usercontests.length > 0) res.send(usercontests[0].contest);
    else res.send("Contest not found");
  } catch (err) {
    console.log(err);
  }
};

const getUsercontests2 = async (req, res) => {
  try {
    let usercontests = await userModelctrl.userModel.find({
      _id: req.body.userId,
    });
    if (usercontests.length > 0) {
      usercontests = usercontests[0].contest;
      const contests = await contestModel.contestModel.find({
        _id: { $in: usercontests },
        status: req.body.status,
      });
      res.send(contests);
    } else res.status(500).send("Contest not found");
  } catch (err) {
    console.log(err);
  }
};
module.exports = { getUsercontests, getUsercontests2 };
