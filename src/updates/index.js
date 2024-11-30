const db = require("../../bot-mongoose");
const commands = require("./commands");
const models = require("./models");
const quote = require("./quoteToList");
const tinder = require("./tinderToList");
const audio = require("./audiolinks");
const redemptions = require("./redemptions");
const clips = require("./clips");

init();

async function init() {
	await db.connectToMongoDB();
	// await commands();
	// await audio();
	// await quote();
	// await tinder();
	// await models();
	// await redemptions();
	await clips();
	// await db.disconnectFromMongoDB();
}
