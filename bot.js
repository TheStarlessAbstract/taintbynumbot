require("dotenv").config();

const mongoose = require("mongoose");

const chatClient = require("./bot-chatclient");
const commands = require("./bot-commands");
const messages = require("./bot-messages");
const pubSubClient = require("./bot-pubsubclient");
const redemptions = require("./bot-redemptions");

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

init();

async function init() {
	chatClient.setup();
	commands.commandsImport();
	messages.messagesImport();
	pubSubClient.setup();
	redemptions.audioImport();
	redemptions.setHydrateBooze();
}
