const db = require("../../../bot-mongoose.js");
const loyaltyPoints = require("./loyaltyPoints.js");

async function init() {
	const dbStatus = await db.getReadyState();
	if (dbStatus === "Mongoose disconnected") {
		await db.connectToMongoDB();
	}

	await loyaltyPoints();

	if (dbStatus === "Mongoose disconnected") {
		await db.disconnectFromMongoDB();
	}
}

module.exports = init;
