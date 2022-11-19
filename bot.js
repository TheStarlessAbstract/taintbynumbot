require("dotenv").config();

const mongoose = require("mongoose");

const chatClient = require("./bot-chatclient");
const pubSubClient = require("./bot-pubsubclient");
const commands = require("./bot-commands");
const discord = require("./bot-discord");

const uri = process.env.MONGO_URI;

process.on("SIGTERM", handle);
process.on("SIGINT", handle);

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

init();

async function init() {
	await chatClient.setup();
	await pubSubClient.setup();
	await discord.setup();
}

async function handle(signal) {
	if (signal == "SIGTERM") {
		await commands.saveKingsState();
		process.exit(0);
	} else if (signal == "SIGINT") {
		await commands.saveKingsState();
		process.exit(0);
	}
}
