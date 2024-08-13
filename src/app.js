require("dotenv").config();

const db = require("../bot-mongoose.js");
const twitchRepo = require("./repos/twitch");
// const pubSubClient = require("./bot-pubsubclient");
// const discord = require("./bot-discord");

init();

async function init() {
	setupSignalHandlers();

	await db.connectToMongoDB();
	if (!(await twitchRepo.init())) db.disconnectFromMongoDB();
	// await pubSubClient.init();
	// await discord.setup();
}

function setupSignalHandlers() {
	// Handle SIGTERM and SIGINT signals
	process.on("SIGTERM", handleSignal);
	process.on("SIGINT", handleSignal);
}

async function handleSignal(signal) {
	if (signal === "SIGTERM") {
		// await kings.saveKingsState();
		process.exit(0);
	} else if (signal === "SIGINT") {
		// await kings.saveKingsState();
		process.exit(0);
	}
}
