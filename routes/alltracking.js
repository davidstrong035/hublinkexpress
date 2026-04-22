//Set up
let express = require("express");
let router = express.Router();

let userModel = require("../schemas/userSchema");


const { trim } = require('express-validator');

router.get("/alltracking", async function(req, res){ 
  try {
    const data = await userModel.find({});
    if (!data || data.length == 0) {
      return res.send({ error: "There's no package with that tracking number." });
    }
    return res.send(data);
  } catch (err) {
    console.error(err);
    return res.send({ error: "There's an issue with the server." });
  }
});



module.exports = router;