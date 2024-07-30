const db = require("../../../bot-mongoose");
const loyaltyPoints = require("./loyaltyPoints");
const users = require("./users");
const counter = require("./counter");
const cardGame = require("./cardGame");

async function init() {
	const dbStatus = await db.getReadyState();
	if (dbStatus === "Mongoose disconnected") {
		await db.connectToMongoDB();
	}

	// await loyaltyPoints();
	// await users();
	// await counter();
	await cardGame();

	if (dbStatus === "Mongoose disconnected") {
		await db.disconnectFromMongoDB();
	}
}

module.exports = init;
