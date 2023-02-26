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

async function disconnectFromMongoDB() {
	await mongoose.disconnect();
}

exports.connectToMongoDB = connectToMongoDB;
exports.disconnectFromMongoDB = disconnectFromMongoDB;
