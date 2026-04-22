//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");

router.delete("/removeTracking/:id", async function(req, res){
  try {
    console.log("Removing Tracking ...");
    const result = await userModel.findByIdAndRemove(req.params.id);
    if (!result) {
      return res.status(400).send({ message: "Unable to remove this tracking at the moment please try again." });
    }
    return res.status(200).send({ message: "Tracking has been removed successfully." });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ message: "Unable to remove this tracking at the moment please try again." });
  }
});


module.exports = router;