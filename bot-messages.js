require("dotenv").config();

const fs = require("fs").promises;

const chatClient = require("./bot-chatclient");

const Message = require("./models/message");

let messages;

async function messagesImport() {
	try {
		messages = JSON.parse(await fs.readFile("./files/messages.json", "UTF-8"));
	} catch (error) {
		messages = await Message.find({});

		if (messages.length > 0) {
			await fs.writeFile(
				"./files/messages.json",
				JSON.stringify(messages, null, 4),
				"UTF-8"
			);
		}
	}
}

async function update(update) {
	let messages = update;
	chatClient.messageUpdate(messages);
	try {
		await fs.writeFile(
			"./files/messages.json",
			JSON.stringify(messages, null, 4),
			"UTF-8"
		);
	} catch {
		// do nothing
	}
}

function get() {
	return messages;
}

exports.get = get;
exports.messagesImport = messagesImport;
exports.update = update;
