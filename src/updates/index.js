const db = require("../../bot-mongoose.js");
const commands = require("./commands");
const models = require("./models");
const quote = require("./quoteToList.js");
const tinder = require("./tinderToList.js");

init();

async function init() {
	await db.connectToMongoDB();
	await commands();
	// await quote();
	// await tinder();
	// await models();
	await db.disconnectFromMongoDB();
}
