//Set up
let express = require("express");
let app = express();
let logger = require("morgan");
let bodyParser = require("body-parser");
let cors = require("cors");

let database = require("./database");
// Endpoint for the login function
app.use(cors());

// Removed deprecated express-validator/check and filter requires; validators should be required where used in routes

app.use(bodyParser.urlencoded({ extended: false })); //Parses urlencoded bodies
app.use(bodyParser.json()); //Send JSON responses

app.use(logger("dev")); // Log requests to API using morgan

// Import all routes
// let login = require("./routes/login");
// let updatebalance = require("./routes/updatebalance");
// let restriction = require("./routes/restriction");
// let kins = require("./routes/kins");
// let transfer = require("./routes/transfer");

let profile = require("./routes/profile");
let liveupdate = require("./routes/liveupdate");
let parcel = require("./routes/parcel");
let create = require("./routes/create");
let alltracking = require("./routes/alltracking");
let removeTracking = require("./routes/removeTracking");
let shipped = require("./routes/shipped");
let transit = require("./routes/transit");
let delivered = require("./routes/delivered");
let contact = require("./routes/contact");

// app.use("/", login);
// app.use("/", updatebalance);
// app.use("/", profile);
// app.use("/", restriction);
// app.use("/", kins);
// app.use("/", transfer);

app.use("/", profile);
app.use("/", liveupdate);
app.use("/", parcel);
app.use("/", create);
app.use("/", alltracking);
app.use("/", removeTracking);
app.use("/", shipped);
app.use("/", transit);
app.use("/", delivered);
app.use("/", contact);

/* var twilio = require('twilio');

// Find your account sid and auth token in your Twilio account Console.
var client = new twilio('AC1c3c63e817d8fae6f9ac9e306b3ec0e7', '740647c8d4b95dcfe004126f4b190a29');

// Send the text message.
client.messages.create({
  to: '+34612432655',
  from: '+34931071116',
  body: 'Hello sir, It\'s me testing the sms capability of Lacaixa Bank'
})
.then((message) => console.log(message.sid));

 */

app.listen(process.env.PORT || 5000);
console.log(
  "Hublink Express Started, listening on port env.PORT Or 5000"
);

module.exports = app;
