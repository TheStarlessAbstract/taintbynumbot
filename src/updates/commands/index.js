const db = require("../../../bot-mongoose.js");
const game = require("./game.js");
const lurk = require("./lurk.js");
const buhhs = require("./buhhs.js");
const title = require("./title.js");
const points = require("./points.js");
const shoutout = require("./shoutout.js");
const followage = require("./followage.js");
const drinkBitch = require("./drinkbitch.js");
const quote = require("./quote.js");
const quoteAdd = require("./quoteAdd.js");
const quoteDelete = require("./quoteDelete.js");
const quoteEdit = require("./quoteEdit.js");
const text = require("./text.js");

async function init() {
	const dbStatus = await db.getReadyState();
	if (dbStatus === "Mongoose disconnected") {
		await db.connectToMongoDB();
	}

	await game();
	await lurk();
	await buhhs();
	await title();
	await points();
	await shoutout();
	await followage();
	await drinkBitch();
	await quote();
	await quoteAdd();
	await quoteDelete();
	await quoteEdit();
	await text();

	if (dbStatus === "Mongoose disconnected") {
		await db.disconnectFromMongoDB();
	}
}

module.exports = init;
