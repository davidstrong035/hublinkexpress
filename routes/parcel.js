//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");


router.post("/parcel", async function(req, res){
  try {
    const data = await userModel.find({ "parcel.tracking": req.body.trackingNumber });
    if (!data || data.length == 0) {
      return res.status(400).send({ message: "There's no package with that tracking number." });
    }

    const updateResult = await userModel.updateOne(
      { "parcel.tracking": req.body.trackingNumber },
      { $push: { "parcel.packages": req.body.parcel } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).send({ message: "Couldn't update the parcel" });
    }

    return res.status(200).send({ message: "Added that parcel to your total parcel" });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: "There's an issue with the server." });
  }
});


module.exports = router;