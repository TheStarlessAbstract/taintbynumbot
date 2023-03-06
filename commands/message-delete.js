const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const Message = require("../models/message");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				helper.isValidModeratorOrStreamer(config) &&
				helper.isValuePresentAndString(config.argument)
			) {
				if (!isNaN(config.argument)) {
					let index = config.argument;

					let message = await Message.findOne({ index: index });
					if (message) {
						result.push("Message deleted - " + index + " was: " + message.text);
						await message.remove();
					} else {
						result.push("No Message " + config.argument + " found");
					}
				} else {
					result.push(
						"!delMessage [index] - index is a number - !delMessage 69"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!delMessage is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push("To delete a Message use !delMessage [index]");
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Deletes an existing message using specified message number",
		usage: "!delMessage 69",
		usableBy: "mods",
		active: true,
	},
];

const deleteMessage = new BaseCommand(commandResponse, versions);

exports.command = deleteMessage;
