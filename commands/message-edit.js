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
				let index = helper.getCommandArgumentKey(config, 0);
				let text = helper.getCommandArgumentKey(config, 1);

				if (
					helper.isValuePresentAndNumber(index) &&
					helper.isValuePresentAndString(text)
				) {
					let message = await Message.findOne({ index: index });

					if (message) {
						if (message.text == text) {
							result.push(
								"Message " + index + " already says: " + message.text
							);
						} else if (message.text != text) {
							result.push("Message " + index + " was: " + message.text);
							message.text = text;
							await message.save();

							let entries = await Message.findOne({});
							messages.update(entries);

							result.push(
								"Message " + index + " has been updated to: " + message.text
							);
						}
					} else {
						result.push("No Message number " + index + " found");
					}
				} else if (!helper.isValuePresentAndNumber(index)) {
					result.push(
						"To edit a Message, you must include the index - !editMessage [index] [updated text]"
					);
				} else if (!helper.isValuePresentAndString(text)) {
					result.push(
						"To edit a Message, you must include the updated text - !editMessage [index] [updated text]"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!editMessage is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push(
					"To edit a Message use !editMessage [index] [updated text]"
				);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Edit an existing timed message",
		usage: "!editMessage 1 Rose needs to be stepped on, will you do it?",
		usableBy: "mods",
		active: true,
	},
];

const editMessage = new BaseCommand(commandResponse, versions);

exports.command = editMessage;
