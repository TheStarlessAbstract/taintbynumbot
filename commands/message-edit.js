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
					helper.isVersionActive(versions, 0) &&
					helper.isValuePresentAndNumber(index) &&
					helper.isValuePresentAndString(text)
				) {
					let message = await Message.findOne({ index: index });
					if (message) {
						result.push("Message " + index + " was: " + message.text);
						message.text = text;
						await message.save();

						let entries = await Message.findOne({});
						messages.update(entries);

						result.push(
							"Message " + index + " has been updated to: " + message.text
						);
					} else {
						result.push("No message number " + config.argument + " found");
					}
				} else if (
					helper.isVersionActive(versions, 1) &&
					helper.isValuePresentAndString(index)
				) {
					let entries = await Message.find({
						text: { $regex: index, $options: "i" },
					});

					if (entries.length > 0) {
						let output;
						if (entries.length > 1) {
							result.push(
								entries.length + " messages found mentioning: " + index
							);

							output = "Indexes include: ";
							let limit = entries.length < 5 ? entries.length : 5;

							for (let i = 0; i < limit; i++) {
								output += entries[i].index + ", ";
							}

							result.push(output.slice(0, -2));

							if (entries.length > 5) {
								result.push(
									"There are more matches, maybe you could be more specific"
								);
							}
						} else {
							output =
								"Use '!editMessage " +
								entries[0].index +
								"' followed by your edit";

							result.push(output);
						}
					} else {
						result.push("No quotes found including '" + index + "'");
					}
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!editMessage command is for Mods only");
			} else if (!isValuePresentAndString(config.argument)) {
				result.push(
					"To edit a message, you must include the message number like !editMessage 69 Rose needs to be stepped on, will you do it?"
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
