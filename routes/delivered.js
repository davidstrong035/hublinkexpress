//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");



router.post("/delivered", async function(req, res){
  try {
    let status = !!req.body.status;

    const data = await userModel.find({ "parcel.tracking": req.body.tracking });
    if (!data || data.length === 0) {
      return res.status(400).send({ message: "There's no package with that tracking number." });
    }

    const updateResult = await userModel.updateOne(
      { "parcel.tracking": req.body.tracking },
      { $set: { "progress.delivered": status } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).send({ message: "Couldn't update the delivered status" });
    }

    return res.status(200).send({ message: "Parcel has been successfully delivered to the receiver" });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: "There's an issue with the server." });
  }
});


module.exports = router;