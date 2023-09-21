require("dotenv").config();

const chatClient = require("./bot-chatclient");
const pubnub = require("./bot-pubnub");
const pubSubClient = require("./bot-pubsubclient");
const discord = require("./bot-discord");
const kings = require("./commands/kings");
const db = require("./bot-mongoose.js");

init();

async function init() {
	// Set up signal handlers
	setupSignalHandlers();

	// Connect to MongoDB and set up other components
	pubnub.setup();
	await db.connectToMongoDB();
	await chatClient.setup();
	await pubSubClient.setup();
	await discord.setup();
}

function setupSignalHandlers() {
	// Handle SIGTERM and SIGINT signals
	process.on("SIGTERM", handleSignal);
	process.on("SIGINT", handleSignal);
}

async function handleSignal(signal) {
	if (signal === "SIGTERM") {
		await kings.saveKingsState();
		process.exit(0);
	} else if (signal === "SIGINT") {
		await kings.saveKingsState();
		process.exit(0);
	}
}
