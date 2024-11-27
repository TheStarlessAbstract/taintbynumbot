const db = require("../../bot-mongoose.js");
const commands = require("./commands");
const models = require("./models");
const quote = require("./quoteToList.js");
const tinder = require("./tinderToList.js");
const audio = require("./audiolinks.js");
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
