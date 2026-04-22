let mongoose = require("mongoose");

class Database {
  constructor() {
    this._connect();
  }
  async _connect() {
    try {
      await mongoose.connect(
        "mongodb://adminsector:AAAaaa111@cluster0-shard-00-00.dkwwo.mongodb.net:27017,cluster0-shard-00-01.dkwwo.mongodb.net:27017,cluster0-shard-00-02.dkwwo.mongodb.net:27017/hublinkexpress?ssl=true&replicaSet=atlas-ba5khr-shard-0&authSource=admin&retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          // useCreateIndex removed in Mongoose 6+, ensure indexes are created via schema options
        }
      );
      console.log("Database connection to Hublink Express successful");
    } catch (err) {
      console.error("Database connection error", err);
    }
  }
}

module.exports = new Database();
