const db = require("../../../bot-mongoose");
const taintySprinkles = require("./taintySprinkles");
const quoteMeDirty = require("./quoteMeDirty");
const hydrate = require("./hydrate");
const rose = require("./rose");
const wendy = require("./wendy");
const boo = require("./boo");
const greaterGood = require("./greaterGood");
const murder = require("./murder");
const irlVoiceBan = require("./irlVoiceBan");
const irlWordBan = require("./irlWordBan");

async function init() {
	const dbStatus = await db.getReadyState();
	if (dbStatus === "Mongoose disconnected") {
		await db.connectToMongoDB();
	}

	await taintySprinkles();
	await quoteMeDirty();
	await hydrate();
	await rose();
	await wendy();
	await boo();
	await greaterGood();
	await murder();
	await irlVoiceBan();
	await irlWordBan();

	if (dbStatus === "Mongoose disconnected") {
		await db.disconnectFromMongoDB();
	}
}

module.exports = init;
