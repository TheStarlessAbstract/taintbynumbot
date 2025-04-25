const buhhs = require("./buhhs"); // working
const deaths = require("./deaths"); // working
const setdeaths = require("./deathsSet"); // working
const drinkBitch = require("./drinkBitch"); // working
const f = require("./f"); // working
const t = require("./t"); // working
const followage = require("./followage"); // working
const game = require("./game"); // working
const lurk = require("./lurk"); // working
const messageAdd = require("./messageAdd");
const messageDelete = require("./messageDelete");
const messageEdit = require("./messageEdit");
const points = require("./points"); // working
const quote = require("./quote"); // working
const quoteAdd = require("./quoteAdd"); // working
const quoteDelete = require("./quoteDelete"); // working
const quoteEdit = require("./quoteEdit"); // working
const shoutout = require("./shoutout"); // working
const song = require("./song"); // working
const steam = require("./steam"); // working
const text = require("./text"); // working
const tinder = require("./tinder"); // working
const tinderAdd = require("./tinderAdd"); // working
const tinderDelete = require("./tinderDelete"); // working
const tinderEdit = require("./tinderEdit"); // working
const title = require("./title"); // working
const commandAdd = require("./commandAdd"); // working
const commandDelete = require("./commandDelete"); // working
const commandEdit = require("./commandEdit"); // working
const kings = require("./kings"); // working
const kingsReset = require("./kingsReset"); // working
const kingsRemain = require("./kingsRemain"); // working

async function init() {
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
}

module.exports = init;
