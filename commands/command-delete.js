const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const Command = require("../models/command");

const commands = require("../bot-commands");
const discord = require("../bot-discord");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				helper.isValidModeratorOrStreamer(config) &&
				helper.isValuePresentAndString(config.argument)
			) {
				if (config.argument.startsWith("!")) {
					let commandName = helper
						.getCommandArgumentKey(config, 0)
						.slice(1)
						.toLowerCase();
					const { response } = (await commands.list[commandName]) || {};

					if (response) {
						let command = await Command.findOne({ name: commandName });

						if (command) {
							let deletion = await Command.deleteOne({ name: commandName });

							if (deletion.deletedCount > 0) {
								delete commands.list[commandName];
								discord.updateCommands("delete", {
									name: commandName,
									description: command.text,
									usage: "!" + commandName,
									usableBy: "users",
								});

								result.push("!" + commandName + " has been deleted");
							} else {
								result.push(
									"!" +
										commandName +
										" has not been deleted, database says no?!"
								);
							}
						} else {
							result.push(
								"!" +
									commandName +
									" is too spicy to be deleted through chat, Starless is going to have to do some work for that, so ask nicely"
							);
						}
					} else {
						result.push(
							"!" +
								commandName +
								" doesn't look to be a command, are you sure you spelt it right, dummy?!"
						);
					}
				} else {
					result.push(
						"To delete a command, include '!' at the start of the command to delete !delcomm ![command name]"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!delcomm command is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push(
					"To delete a command, you must include the name of the command to be deleted - '!delcomm ![command name]"
				);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Deletes a command",
		usage: "!delcomm !oldcommand",
		usableBy: "mods",
		active: true,
	},
];

const delCommand = new BaseCommand(commandResponse, versions);

exports.command = delCommand;
