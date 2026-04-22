let mongoose = require("mongoose");
//let validator = require("validator");

let usersSchema = new mongoose.Schema({
	sender: {
		name: String,
		address: String,
		country: String,
		tel: Number,
		email: String
	},
	receiver: {
		name: String,
		address: String,
		country: String,
		tel: Number,
		email: String
	},
	parcel:{
		tracking: {
			type: String,
			unique: true
		},
		packages: [String],
	},
	shippinginformation: {
		carrier: String,
		shipmentmode: String,
		deliveryduration: String,
		shipmentdate: String,
		deliverydate: String
	},
	progress: {
		shipped: {
			type: Boolean,
			default: false
		},
		transit: {
			type: Boolean,
			default: false
		},
		delivered: {
			type: Boolean,
			default: false
		},
		
	},
	liveUpdate: [
		{
			timePosted: String,
			Information: String,
			datePosted: Date,
			location: String
		}
	],
		
}, {minimize: false})



module.exports = mongoose.model("logistic", usersSchema) 