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
				helper.isValidModeratorOrStreamer(config.userInfo) &&
				helper.isValuePresentAndString(config.argument)
			) {
				if (config.argument.startsWith("!")) {
					let commandName = helper
						.getCommandArgumentKey(config.argument, 0)
						.slice(1)
						.toLowerCase();
					let commandText = helper.getCommandArgumentKey(config.argument, 1);

					if (commandText) {
						const { response } = commands.list[commandName]?.getCommand() || {};

						if (response) {
							let command = await Command.findOne({ name: commandName });

							if (command && command.text != commandText) {
								commands.list[commandName] = new BaseCommand(() => {
									return {
										response: command.text,
									};
								}, [
									{
										description: command.text,
										usage: "!" + command.name,
										usableBy: "users",
										active: true,
									},
								]);

								command.text = commandText;
								await command.save();

								discord.updateCommands("edit", {
									name: commandName,
									description: commandText,
									usage: "!" + commandName,
									usableBy: "users",
								});

								result.push("!" + commandName + " has been edited!");
							} else if (command && command.text == commandText) {
								result.push(
									"!" + commandName + " already says: " + commandText
								);
							} else {
								result.push(
									"!" +
										commandName +
										" is too spicy to be edited through chat, Starless is going to have to do some work for that, so ask nicely"
								);
							}
						} else {
							result.push(
								"!" +
									commandName +
									" doesn't look to be a command, are you sure you spelt it right, dummy?!"
							);
						}
					} else if (!commandName) {
						result.push(
							"To edit a Command, you must include the command name - !editComm ![command name] [command text]"
						);
					} else {
						result.push(
							"To edit a Command, you must include the edited command text - !editComm ![command name] [edited command text]"
						);
					}
				} else {
					result.push(
						"To edit a Command, command name must start with '!' - !editComm ![command name] [edited command text]"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				result.push("!editComm is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push(
					"To edit a Command, use !editComm ![command name] [edited command text]"
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
