const BaseCommand = require("../classes/base-command");

const Message = require("../models/message");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				let index = config.argument.split(/\s(.+)/)[0].toLowerCase();
				let text = config.argument.split(/\s(.+)/)[1];

				if (versions[0].active && !isNaN(index)) {
					let quote = await Message.findOne({ index: index });
					if (quote) {
						result.push("Message " + index + " was: " + quote.text);
						await quote.remove();
					} else {
						result.push("No message number " + config.argument + " found");
					}
				} else if (versions[1].active && config.argument && isNaN(index)) {
					console.log(text);
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
								" is the number of the message you are looking to delete. Use !delMessage " +
								entries[0].index;
						}
					} else {
						result.push("No messages found including '" + text + "'");
					}
				}
			} else if (!config.isModUp) {
				result.push(["!delMessage command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To delete a message, you must include the message number like !delMessage 69, or include a search string like !delMessage uwu to find the number of the message",
				]);
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
