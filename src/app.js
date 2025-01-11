require("dotenv").config();

const db = require("./services/db");
const twitchRepo = require("./repos/twitch");
const discord = require("./services/discord");
// const discord = require("../bot-discord");

init();

async function init() {
	setupSignalHandlers();

	await db.connect();
	if (!(await twitchRepo.init())) await db.disconnect();
	await discord.init();
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
