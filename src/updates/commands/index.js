const db = require("../../../bot-mongoose.js");
const textcommands = require("./textCommands.js");
const lurk = require("./lurk.js");
const drinkBitch = require("./drinkbitch.js");
const buhhs = require("./buhhs.js");
const followage = require("./followage.js");
const shoutout = require("./shoutout.js");
const game = require("./game.js");
const title = require("./title.js");

async function init() {
	const dbStatus = await db.getReadyState();
	if (dbStatus === "Mongoose disconnected") {
		await db.connectToMongoDB();
	}

	await textcommands();
	await lurk();
	await drinkBitch();
	await buhhs();
	await followage();
	await shoutout();
	await game();
	await title();

	if (dbStatus === "Mongoose disconnected") {
		await db.disconnectFromMongoDB();
	}
}

module.exports = init;
