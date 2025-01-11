const mongoose = require("../../repos/mongoose");

async function mongooseConnect() {
	await mongoose.connect();
	console.log(mongooseConnectionState());
}

async function mongooseDisconnect() {
	await mongoose.disconnect();
	console.log(mongooseConnectionState());
}

function mongooseConnectionState() {
	let readyState;

	switch (mongoose.getReadyState()) {
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

exports.connect = mongooseConnect;
exports.disconnect = mongooseDisconnect;
exports.getReadyState = mongooseConnectionState;
