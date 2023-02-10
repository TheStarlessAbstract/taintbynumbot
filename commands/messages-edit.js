const BaseCommand = require("../classes/base-command");

const Message = require("../models/message");

const messages = require("../bot-messages");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				isValidModeratorOrStreamer(config) &&
				isValuePresentAndString(config.argument)
			) {
				let index = getCommandArgumentKey(config, 0);
				let text = getCommandArgumentKey(config, 1);

				// let index = config.argument.split(/\s(.+)/)[0].toLowerCase();
				// let text = config.argument.split(/\s(.+)/)[1];

				if (versions[0].active && !isNaN(index)) {
					let quote = await Message.findOne({ index: index });
					if (quote) {
						result.push("Message " + index + " was: " + quote.text);
						quote.text = text;
						await quote.save();

						result.push(
							"Message " + index + " has been updated to: " + quote.text
						);
					} else {
						result.push("No message number " + config.argument + " found");
					}
				} else if (versions[1].active && config.argument && isNaN(index)) {
					let entries = await Message.find({
						text: { $regex: text, $options: "i" },
					});

					if (entries.length > 0) {
						let pularlity = entries.length > 1 ? "messages" : "message";

						result.push(
							entries.length + " " + pularlity + " found mentioning: " + text
						);

						let output;
						if (entries.length > 1) {
							output = "Indexes include: ";
							for (let i = 0; i < 5; i++) {
								output += entries[i].index + ", ";
							}

							result.push(output);

							if (entries.length > 5) {
								result.push(
									"There are more matches, maybe you could be more specific"
								);
							}
						} else {
							output =
								entries[0].index +
								" is the number of the message you are looking to edit. Use !editMessage " +
								entries[0].index;
						}
					} else {
						result.push("No quotes found including '" + text + "'");
					}
				}
			} else if (!isValidModeratorOrStreamer(config)) {
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
	{
		description:
			"Searches for an existing message that contains the string 'Rose', will return the number of the message, or messages that match. User other option to edit chosen message",
		usage: "!editMessage Rose",
		usableBy: "mods",
		active: true,
	},
];

function isValidModeratorOrStreamer(config) {
	return config.isBroadcaster || config.isModUp;
}

function isValuePresentAndString(value) {
	return value != undefined && typeof value === "string" && value != "";
}

function getCommandArgumentKey(config, index) {
	if (isValuePresentAndString(config.argument)) {
		let splitData = config.argument.split(/\s(.+)/);
		if (index == 0) {
			return splitData[index].toLowerCase();
		} else if (splitData[index] != undefined) {
			return splitData[index];
		}
	}
	return "";
}

const editMessage = new BaseCommand(commandResponse, versions);

exports.command = editMessage;
exports.isValidModeratorOrStreamer = isValidModeratorOrStreamer;
exports.isValuePresentAndString = isValuePresentAndString;
exports.getCommandArgumentKey = getCommandArgumentKey;
