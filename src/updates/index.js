const db = require("../../bot-mongoose.js");
const commands = require("./commands");
const models = require("./models");

init();

async function init() {
	await db.connectToMongoDB();
	await commands();
	// await models();
	await db.disconnectFromMongoDB();
}
