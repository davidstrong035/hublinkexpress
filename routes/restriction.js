//Set up
let express = require("express");
let router = express.Router();

let userModel = require("../schemas/userSchema");



router.get("/restriction/:user", function(req, res){ 
	//console.log("inside restriction");
	//let check = req.params();
	userModel.find({"bio.login.username": req.param("user")})
		.then(data=> {
			//console.log(data[0])
			res.send({"restricted": data[0].status.restricted, "message": data[0].status.message, "balance": data[0].account.accountbalance, "currency": data[0].account.currency});
		})
		.catch(err=> res.send({"error": "There's an issue with the server."}))
});


module.exports = router;