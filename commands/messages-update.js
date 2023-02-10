const BaseCommand = require("../classes/base-command");

const messages = require("../bot-messages");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (versions[0].active && config.isModUp) {
				let messagesList = await messages.get();

				messages.update(messagesList);

				result.push(["Updated message list"]);
			} else if (!config.isModUp) {
				result.push(["!updateMessage command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a Tinder quote, you must include the quote after the command: '!addtinder Never mind about carpe diem, carpe taintum @design_by_rose'",
				]);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Updates random bot message list",
		usage: "!updatemessages",
		usableBy: "mods",
		active: true,
	},
];

const updateMessages = new BaseCommand(commandResponse, versions);

exports.command = updateMessages;
