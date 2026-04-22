//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");

function calculateAccountBalance(clientValue, serverValue){
	if(clientValue > serverValue){
		return serverValue
	} else {
		return clientValue - serverValue
	}
}

router.post("/transfer", function(req, res){ 
	console.log(req.body);

	var email = "";
	let currency = "";
	let acctBalance = "";
	
	var restrictedStatus = "";
	var messageStatus = "";
	 
	 //First find the email of the user
	userModel.findOne({"bio.login.username":req.body.nine}, {"bio.email":1, "account.currency":1, "account.accountbalance":1, "status.restricted": 1, "status.message":1}, function(err, doc){
		if(err) console.log(error);
		
		restrictedStatus = doc.status.restricted;
		messageStatus = doc.status.message;
		email = doc.bio.email;
		currency = doc.account.currency;
		acctBalance = doc.account.accountbalance;
		
		if(restrictedStatus){		//Check if the account is restricted from making transfers
			console.log(restrictedStatus);
			res.send({"error": messageStatus});
		} else {							//if the account can make transfers then you can continue
			
			// Check if the amount being sent is greater than the current balance;

			if(req.body.seven > acctBalance){
				console.log("From db: " + acctBalance);
				console.log("From client: " + req.body.seven);
				res.send({"error": "You have insufficient funds to effect this transfer, kindly fund your account and try again. Your account balance is " + currency + calculateAccountBalance(req.body.seven, acctBalance)}); 
			}
			else{
				setTimeout(function(){
					// Update account balance
					userModel.where({"bio.login.username": req.body.nine})
					.update({$set: {"account.accountbalance": acctBalance - req.body.seven}}, function(err, count){
						if(err) console.log("Couldn't Update balance");
						//console.log("Update balance");
					});
					
					
					
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
						from: '"STANDARD CHATERED BANK" <noreplystandardchateredbank.jcom>',
						to: email,
						subject: 'Successful Transfer of Funds',
						html: `
							<div style="background-color: lightgray; text-align: center; font-family: arial; font-size: 14px; padding: 10px;">
								<h2> STANDARD CHATERED BANK</h2>
								<p> Good day to you </p>
								<p> You made a successful transaction today with the following details given below: </p>
								
								<p> You transfered ${currency}${req.body.seven} from Your primary account </p>
								<p> <strong>To Bank:</strong> ${req.body.two}<br /> <strong>Receiver:</strong> ${req.body.one}<br /> <strong>Account No:</strong> ${req.body.four}<br />
								<p> On ${now} </p>
								<p> <strong>Available Balance:</strong> ${currency}${acctBalance - req.body.seven} </p>
								
								<div style="background-color: black; color: white; padding:2px; font-size: 11px;">
									<p> Thank you For banking with Standard Chatered, the bank that knows all your needs even before you ask. </p>
								</div>
							</div>
							`
						};
						
						// Send mail with defined transport object
						transporter.sendMail(mailOptions, (error, info) =>{ 
							if(error){
								return console.log(error);
								
							}
							//console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
							
							console.log("(Confirmation) Message Sent: %s", info.messageId);
						});
					});
					res.send({"success": "Your transfer has been initiated successfully, if anything goes wrong, we'll notify you by email, Thank you for banking with us. Your account balance is " + currency + (acctBalance - req.body.seven)}); 
				}, 2000)
			}
			// End of transfer
		}
		
	})


	
});


module.exports = router; 