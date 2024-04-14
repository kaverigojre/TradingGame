const organiserModelCtrl = require("../../models/organiserModel");

const addwalletorganiser = async (req, res) => {
    var organiser = await organiserModelCtrl.organiserModel.find({
      _id: req.body.id,
    });
  
    if(organiser.length>0){
      organiser=organiser[0]
        price=parseFloat(req.body.price);
        if(price>0){
        organiser.wallet= parseFloat(organiser.wallet)+price;
        var newOrganiser = organiserModelCtrl.organiserModel(organiser);
         await newOrganiser.save();
         res.status(200).send("Added Successfully");
        }
        else{
            res.status(500).send("Invalid price");
        }
    }
    else{
        res.status(500).send("Organiser not found");
    }
};
module.exports = {
  addwalletorganiser
};
