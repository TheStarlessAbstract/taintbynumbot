require("dotenv").config();

const chatClient = require("./bot-chatclient");

const Message = require("./models/message");

let messages = [];

async function messagesImport() {
	messages = await Message.find({});
}

async function update(update) {
	messages = update;
	chatClient.messageUpdate(messages);
}

function get() {
	return messages;
}

exports.get = get;
exports.messagesImport = messagesImport;
exports.update = update;
