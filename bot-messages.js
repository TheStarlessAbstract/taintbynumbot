const chatClient = require("./bot-chatclient");

const Message = require("./models/message");

function update(update) {
	chatClient.messageUpdate(update);
}

async function get() {
	return await Message.find({});
}

exports.get = get;
exports.update = update;
