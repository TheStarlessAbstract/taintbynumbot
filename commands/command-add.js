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
						const { response } = commands.list[commandName] || {};

						if (!response) {
							let newCommand = new Command({
								name: commandName,
								text: commandText,
								createdBy: config.userInfo.displayName,
							});

							await newCommand.save();

							commands.list[commandName] = {
								response: commandText,
							};

							discord.updateCommands("add", {
								name: commandName,
								description: commandText,
								usage: "!" + commandName,
								usableBy: "users",
							});

							result.push("!" + commandName + " has been created!");
						} else if (response) {
							result.push("!" + commandName + " already exists");
						}
					} else {
						result.push(
							"To add a Command, you must include the Command text: '!addcomm !Yen Rose would really appreciate it if Yen would step on her'"
						);
					}
				} else {
					result.push(
						"New command must start with '!' - '!addcomm ![newcommand] [command output]"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!addComm command is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push(
					"To add a Command, you must include the Command name, and follwed by the the Command output, new Command must start with !: '!addcomm !Yen Rose would really appreciate it if Yen would step on her'"
				);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Creates a new command",
		usage: "!addcomm !newcommand This is what a new command looks like",
		usableBy: "mods",
		active: true,
	},
];

const addCommand = new BaseCommand(commandResponse, versions);

exports.command = addCommand;
