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

					if (commandName) {
						const { response } = commands.list[commandName]?.getCommand() || {};

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
							"To delete a Command, you must include the command name - !delComm ![command name]"
						);
					}
				} else {
					result.push(
						"To delete a Command, command name must start with '!' - !delComm ![command name]"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!delComm Command is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push("To delete a Command, use !delComm ![command name]");
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
