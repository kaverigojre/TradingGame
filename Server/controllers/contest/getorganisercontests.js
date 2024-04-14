const userModelctrl = require("../../models/userModel");
const contestModelctrl = require("../../models/contestModel");
const getOrganisercontests = async (req, res) => {
  try {
    // console.log(req.body)
    const organisercontests = await contestModelctrl.contestModel.find(
      {
        organisedBy: req.body._id,
        status: req.body.status
      },
    );
   
    res.send(organisercontests);
  } catch (err) {
    console.log(err);
  }
};
module.exports = { getOrganisercontests };
