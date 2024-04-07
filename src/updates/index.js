const db = require("../../bot-mongoose.js");
const textcommands = require("./textcommands.js");
const lurk = require("./lurk.js");
const drinkBitch = require("./drinkbitch.js");

runUpdates();

async function runUpdates() {
	await db.connectToMongoDB();
	// await textcommands();
	await lurk();
	// await drinkBitch();
	await db.disconnectFromMongoDB();
}
