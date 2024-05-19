const db = require("../../../bot-mongoose.js");
const loyaltyPoints = require("./loyaltyPoints.js");
const users = require("./users.js");

async function init() {
	const dbStatus = await db.getReadyState();
	if (dbStatus === "Mongoose disconnected") {
		await db.connectToMongoDB();
	}

	// await loyaltyPoints();
	await users();

	if (dbStatus === "Mongoose disconnected") {
		await db.disconnectFromMongoDB();
	}
}

module.exports = init;
