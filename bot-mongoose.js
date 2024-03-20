require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

async function connectToMongoDB() {
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	mongoose.set("strictQuery", false);

	console.log(getReadyState());
}

async function disconnectFromMongoDB() {
	await mongoose.disconnect();
}

function getReadyState() {
	let readyState;

	switch (mongoose.connection.readyState) {
		case 0:
			readyState = "Mongoose disconnected";
			break;
		case 1:
			readyState = "Mongoose connected";
			break;
		case 2:
			readyState = "Mongoose connecting";
			break;
		case 3:
			readyState = "Mongoose disconnecting";
			break;
		default:
			readyState = "Unknown connection state";
	}

	return readyState;
}

exports.connectToMongoDB = connectToMongoDB;
exports.disconnectFromMongoDB = disconnectFromMongoDB;
exports.getReadyState = getReadyState;
