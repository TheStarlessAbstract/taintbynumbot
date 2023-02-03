const BaseCommand = require("../classes/base-command");

const Command = require("../models/command");

const commands = require("../bot-commands");
const discord = require("../bot-discord");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				if (config.argument.startsWith("!")) {
					let commandName = config.argument
						.split(/\s(.+)/)[0]
						.slice(1)
						.toLowerCase();
					let commandText = config.argument.split(/\s(.+)/)[1];

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

								result.push(["!" + commandName + " has been edited!"]);
							} else {
								result.push([
									"!" +
										commandName +
										" is too spicy to be edited through chat, Starless is going to have to do some work for that, so ask nicely",
								]);
							}
						} else {
							result.push(["No command found by this name !" + commandName]);
						}
					} else {
						result.push([
							"To edit a Command, you must include the Command name, and follwed by the new Command output, Command must start with '!' '!editcomm !Yen Rose would really appreciate it if Yen would step on her'",
						]);
					}
				} else {
					result.push([
						"Command being edited must start with '!' !editcomm !editcommand this is what an edit command looks like",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!editcomm command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To edit a Command, you must include the Command name, and follwed by the the Command output, edited Command must start with !: '!editcomm !Yen Rose would really appreciate it if Yen would step on her'",
				]);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Edits an existing command",
		usage: "!editcomm !newCommand This is an edited command",
		usableBy: "mods",
		active: true,
	},
];

const addCommand = new BaseCommand(commandResponse, versions);

exports.command = addCommand;
