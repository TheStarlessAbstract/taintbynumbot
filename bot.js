require("dotenv").config();

const mongoose = require("mongoose");

const chatClient = require("./bot-chatclient");
const pubSubClient = require("./bot-pubsubclient");
const redemptions = require("./bot-redemptions");

const uri = process.env.MONGO_URI;

process.on("SIGTERM", handle);

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

init();

async function init() {
	await chatClient.setup();
	await pubSubClient.setup();
}

async function handle(signal) {
	if (signal == "SIGTERM") {
		await redemptions.saveKingsState();
		process.exit(0);
	}
}
