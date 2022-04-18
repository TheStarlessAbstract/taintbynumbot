require("dotenv").config();

const chatClient = require("./bot-chatclient");

const Message = require("./models/message");

let messages = [];

async function setup() {
	messages = await Message.find({});
}

async function update(update) {
	messages = update;
	chatClient.messageUpdate(messages);
}

function get() {
	return messages;
}

exports.setup = setup;
exports.get = get;
exports.update = update;
