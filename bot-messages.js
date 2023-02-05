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

async function get() {
	return await Message.find({});
}

exports.setup = setup;
exports.get = get;
exports.update = update;
