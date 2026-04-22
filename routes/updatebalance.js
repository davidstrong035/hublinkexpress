//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");



router.post("/updateBalance", function(req, res){ 
	console.log(req.body.three);

	var email = "";
	let currency = "";
	//Update the processing field in the database
	userModel.where({"bio.login.username": req.body.one})
		.update({$set: {"account.accountbalance": req.body.three}}, function(err, count){
			if(err) console.log("Couldn't Update balance");
			//console.log("Update balance");
		});
	
	userModel.findOne({"bio.login.username":req.body.one}, {"bio.email":1, "account.currency":1}, function(err, doc){
		if(err) console.log(error);
		//console.log("Doc is: " + doc);
		email = doc.bio.email;
		currency = doc.account.currency;
	})


	setTimeout(function(){
		//Generate test SMTP Service account from ethereal.email
	//Only needed if you don't a real mail account for testing
	
	nodemailer.createTestAccount((err, account) => {
		// Create reusable transporter object using the default
		// SMTP transporter
		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			secureConnection: true,
			port: 465,
			auth: {
				user: 'noreplypaypalincc@gmail.com',	// Generated eheereal User
				pass: 'pppppp111'	// Generated etheral pass
			}
		});
		 
		let now = new Date();
		let mailOptions = {
			from: '"La Caixa Bank" <noreply@lacaixa.com>',
			to: email,
			subject: 'Successful Transfer of Funds',
			html: `
				<div style="background-color: lightgray; text-align: center; font-family: arial; font-size: 14px; padding: 10px;">
					<h2> LA CAIXA BANK</h2>
					<p> Good day to you </p>
					<p> You made a successful transaction today with the following details given below: </p>
					
					<p> You transfered ${currency}${req.body.two} from Your primary account </p>
					<p> <strong>To Bank:</strong> ${req.body.six}<br /> <strong>Receiver:</strong> ${req.body.seven}<br /> <strong>Account No:</strong> ${req.body.four}<br /> <strong>Routing No.:</stron> ${req.body.five} </p>
					<p> On ${now} </p>
					<p> <strong>Available Balance:</strong> ${req.body.three} </p>
					
					<div style="background-color: black; color: white; padding:2px; font-size: 11px;">
						<p> Thank you For banking with LaCaixa, the bank that knows all your needs even before you ask. </p>
					</div>
				</div>
				`
			};
			
			// Send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) =>{ 
				if(error){
					return console.log(error);
				}
				console.log("(Confirmation) Message Sent: %s", info.messageId);
				//console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
			});
		});
	}, 2000)
	
	res.send({"success":"Message sent successfully!"}); 
});


module.exports = router; 