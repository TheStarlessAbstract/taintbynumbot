require("dotenv").config();

const mongoose = require("mongoose");

const chatClient = require("./bot-chatclient");
const pubSubClient = require("./bot-pubsubclient");

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

init();

async function init() {
	await chatClient.setup();
	await pubSubClient.setup();
}
