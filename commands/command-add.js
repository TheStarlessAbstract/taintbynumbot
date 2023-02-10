const BaseCommand = require("../classes/base-command");

const Command = require("../models/command");

const commands = require("../bot-commands");
const discord = require("../bot-discord");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				versions[0].active &&
				config.isModUp &&
				config.argument &&
				config.argument.startsWith("!")
			) {
				let commandName = config.argument
					.split(/\s(.+)/)[0]
					.slice(1)
					.toLowerCase();
				let commandText = config.argument.split(/\s(.+)/)[1];

				if (commandText) {
					const { response, details } = commands.list[commandName] || {};

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

						result.push(["!" + commandName + " has been created!"]);
					} else if (response) {
						result.push(["!" + commandName + " already exists"]);
					}
				} else {
					result.push([
						"To add a Command, you must include the Command text: '!addcomm !Yen Rose would really appreciate it if Yen would step on her'",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!addComm command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a Command, you must include the Command name, and follwed by the the Command output, new Command must start with !: '!addcomm !Yen Rose would really appreciate it if Yen would step on her'",
				]);
			} else if (!config.argument.startsWith("!")) {
				result.push([
					"New command must start with '!' !addcomm !newcommand this is what a new command looks like",
				]);
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
