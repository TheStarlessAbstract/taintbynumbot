require("dotenv").config();

const mongoose = require("mongoose");

const chatClient = require("./bot-chatclient");
const pubSubClient = require("./bot-pubsubclient");
const commands = require("./bot-commands");
const discord = require("./bot-discord");

const uri = process.env.MONGO_URI;

init();

async function init() {
	// Set up signal handlers
	setupSignalHandlers();

	// Connect to MongoDB and set up other components
	await connectToMongoDB();
	await chatClient.setup();
	await pubSubClient.setup();
	await discord.setup();
}

async function connectToMongoDB() {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (error) {
		// Handle the error
	}
}

function setupSignalHandlers() {
	// Handle SIGTERM and SIGINT signals
	process.on("SIGTERM", handleSignal);
	process.on("SIGINT", handleSignal);
}

async function handleSignal(signal) {
	if (signal === "SIGTERM") {
		await commands.saveKingsState();
		process.exit(0);
	} else if (signal === "SIGINT") {
		await commands.saveKingsState();
		process.exit(0);
	}
}
