const Command = require("../models/command");

const commands = require("../bot-commands");
const discord = require("../bot-discord");

let versions = [
	{
		description: "Deletes a command",
		usage: "!delcomm !oldcommand",
		usableBy: "mods",
		active: true,
	},
];

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				if (config.argument.startsWith("!")) {
					let commandName = config.argument.slice(1).toLowerCase();
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
							result.push([
								"!" +
									commandName +
									" is too spicy to be deleted through chat, Starless is going to have to do some work for that, so ask nicely",
							]);
						}
					} else {
						result.push([
							"!" +
								commandName +
								" doesn't look to be a command, are you sure you spelt it right, dummy?!",
						]);
					}
				} else {
					result.push([
						"To specify the command to delete, include '!' at the start !delcomm !oldcommand",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!delcomm command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To delete a command, you must include the command name, command being deleted must start with '!' : '!delcomm !oldcommand",
				]);
			}

			return result;
		},
	};
};

function getVersions() {
	return versions;
}

function setVersionActive(element) {
	versions[element].active = !versions[element].active;
}

exports.getCommand = getCommand;
exports.getVersions = getVersions;
exports.setVersionActive = setVersionActive;
