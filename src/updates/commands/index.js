const db = require("../../../bot-mongoose");
const buhhs = require("./buhhs");
const deaths = require("./deaths");
const setdeaths = require("./deathsSet");
const drinkBitch = require("./drinkBitch");
const f = require("./f");
const t = require("./t");
const followage = require("./followage");
const game = require("./game");
const lurk = require("./lurk");
const messageAdd = require("./messageAdd");
const messageDelete = require("./messageDelete");
const messageEdit = require("./messageEdit");
const points = require("./points");
const quote = require("./quote");
const quoteAdd = require("./quoteAdd");
const quoteDelete = require("./quoteDelete");
const quoteEdit = require("./quoteEdit");
const shoutout = require("./shoutout");
const song = require("./song");
const steam = require("./steam");
const text = require("./text");
const tinder = require("./tinder");
const tinderAdd = require("./tinderAdd");
const tinderDelete = require("./tinderDelete");
const tinderEdit = require("./tinderEdit");
const title = require("./title");
const commandAdd = require("./commandAdd");
const commandDelete = require("./commandDelete");
const commandEdit = require("./commandEdit");
const kings = require("./kings");
const kingsReset = require("./kingsReset");
const kingsRemain = require("./kingsRemain");

async function init() {
	const dbStatus = await db.getReadyState();
	if (dbStatus === "Mongoose disconnected") {
		await db.connectToMongoDB();
	}

	await buhhs();
	await deaths();
	await setdeaths();
	await drinkBitch();
	await f();
	await t();
	await followage();
	await game();
	await lurk();
	await messageAdd();
	await messageDelete();
	await messageEdit();
	await points();
	await quote();
	await quoteAdd();
	await quoteDelete();
	await quoteEdit();
	await shoutout();
	await song();
	await steam();
	await text();
	await tinder();
	await tinderAdd();
	await tinderDelete();
	await tinderEdit();
	await title();
	await commandAdd();
	await commandDelete();
	await commandEdit();
	await kings();
	await kingsReset();
	await kingsRemain();

	if (dbStatus === "Mongoose disconnected") {
		await db.disconnectFromMongoDB();
	}
}

module.exports = init;
