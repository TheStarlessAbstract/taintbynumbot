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
					let commandText = helper.getCommandArgumentKey(config, 1);

					if (commandText) {
						const { response } = (await commands.list[commandName]) || {};

						if (response) {
							let command = await Command.findOne({ name: commandName });

							if (command) {
								commands.list[commandName] = {
									response: commandText,
								};

								command.text = commandText;
								await command.save();

								discord.updateCommands("edit", {
									name: commandName,
									description: commandText,
									usage: "!" + commandName,
									usableBy: "users",
								});

								result.push("!" + commandName + " has been edited!");
							} else {
								result.push(
									"!" +
										commandName +
										" is too spicy to be edited through chat, Starless is going to have to do some work for that, so ask nicely"
								);
							}
						} else {
							result.push("No command found by this name !" + commandName);
						}
					} else {
						result.push(
							"To edit a Command, you must include the Command name, and followed by the new Command output, Command must start with '!' '!editcomm !Yen Rose would really appreciate it if Yen would step on her'"
						);
					}
				} else {
					result.push(
						"Command being edited starts with '!' - !editComm ![command name] [edited command output]"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!editcomm command is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push(
					"To edit a Command, you must include the Command name, and followed by the the Command output, edited Command must start with !: '!editcomm !Yen Rose would really appreciate it if Yen would step on her'"
				);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Edits an existing command",
		usage: "!editcomm ![command name] [updated text for command]",
		usableBy: "mods",
		active: true,
	},
];

const editCommand = new BaseCommand(commandResponse, versions);

exports.command = editCommand;
