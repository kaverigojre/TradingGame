const organiserModelCtrl = require("../../models/organiserModel");

const organiserProfilechange = async (req, res) => {
  console.log(req.body);
  var organiser = await organiserModelCtrl.organiserModel.find({
    _id: req.body.id,
  });

  if (organiser.length > 0) {
    organiser = organiser[0];
   
      organiser.img = req.body.img;
      var newOrganiser = organiserModelCtrl.organiserModel(organiser);
      await newOrganiser.save();
      res.status(200).send("Added Successfully");
  } else {
    res.status(500).send("Organiser not found");
  }
};
module.exports = {
  organiserProfilechange,
};
