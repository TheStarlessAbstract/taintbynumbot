const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const Message = require("../models/message");
const messages = require("../bot-messages");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				helper.isValidModeratorOrStreamer(config) &&
				helper.isValuePresentAndString(config.argument)
			) {
				let existingMessage = await Message.findOne({ text: config.argument });

				if (existingMessage == null) {
					let messageList = await Message.find({});

					let message = await Message.create({
						index: helper.getNextIndex(messageList),
						text: config.argument,
						addedBy: config.userInfo.displayName,
					});

					messageList.push(message);
					messages.update(messageList);

					result.push("Message added - " + message.index + ": " + message.text);
				} else {
					result.push("This Message has already been added");
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!addMessage command is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push("To add a Message use !addMessage [message output]");
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Creates a new timed message",
		usage: "!addmessage DM @design_by_rose for all your dick graphic needs",
		usableBy: "mods",
		active: true,
	},
];

const addMessage = new BaseCommand(commandResponse, versions);

exports.command = addMessage;
