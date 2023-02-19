require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

function connectToMongoDB() {
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	mongoose.set("strictQuery", false);
}

function disconnectFromMongoDB() {
	mongoose.disconnect();
}

exports.connectToMongoDB = connectToMongoDB;
exports.disconnectFromMongoDB = disconnectFromMongoDB;
