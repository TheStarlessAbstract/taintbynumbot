const BaseCommand = require("../classes/base-command");

const Message = require("../models/message");

const messages = require("../bot-messages");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (versions[0].active && config.isModUp && config.argument) {
				let messagesList = await messages.get();
				try {
					let message = await Message.create({
						text: config.argument,
						addedBy: config.userInfo.displayName,
					});

					messagesList.push(message);
					messages.update(messagesList);

					result.push(["Added new message"]);
				} catch (err) {
					if (err.code == 11000) {
						result.push("This message has already been added");
					} else {
						console.log(err);
						result.push(
							"There was some problem adding this message, and Starless should really sort this shit out."
						);
					}
				}
			} else if (!config.isModUp) {
				result.push(["!addmessage command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a timed message for the bot to say intermittently, you must include the message after the command: '!addmessage DM @design_by_rose for all your dick graphic needs'",
				]);
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
