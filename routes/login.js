//Set up
let express = require("express");
let router = express.Router();

let userModel = require("../schemas/userSchema");



router.post("/login", function(req, res){ 
	userModel.find({"bio.login.username": req.body.one}, function(err, user){
		if(err){
			//console.log("An error occured");
			res.send({"error": " There was an error processing your request."})
		}else{
			if(user.length > 0){
				//console.log(user);
				if((req.body.one == user[0].bio.login.username) && (req.body.two == user[0].bio.login.password)){
					res.send({"username": req.body.one, "password": req.body.two, "name": user[0].bio.name});
					console.log("User found")
				} else{					
					res.send({"error": "Your username and/or password isn't correct. Please try again"})
				}
			} else{
				//console.log("User not registered");
				res.send({"error": " " + req.body.one+" isn't registered on our database"})
			}
		}
	})
});


module.exports = router;