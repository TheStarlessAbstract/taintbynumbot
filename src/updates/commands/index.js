const db = require("../../../bot-mongoose");
const game = require("./game");
const lurk = require("./lurk");
const buhhs = require("./buhhs");
const title = require("./title");
const points = require("./points");
const shoutout = require("./shoutout");
const followage = require("./followage");
const drinkBitch = require("./drinkbitch");
const quote = require("./quote");
const quoteAdd = require("./quoteAdd");
const quoteDelete = require("./quoteDelete");
const quoteEdit = require("./quoteEdit");
const text = require("./text");
const song = require("./song");
const steam = require("./steam");
const messageAdd = require("./messageAdd");

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
	await song();
	await steam();
	await messageAdd();

	if (dbStatus === "Mongoose disconnected") {
		await db.disconnectFromMongoDB();
	}
}

module.exports = init;
