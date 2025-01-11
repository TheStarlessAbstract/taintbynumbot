require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

async function connect() {
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	mongoose.set("strictQuery", false);
}

async function disconnect() {
	await mongoose.disconnect();
}

function getReadyState() {
	return mongoose.connection.readyState;
}

exports.connect = connect;
exports.disconnect = disconnect;
exports.getReadyState = getReadyState;
