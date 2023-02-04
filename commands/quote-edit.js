const BaseCommand = require("../classes/base-command");

const Quote = require("../models/quote");

// const commands = require("../bot-commands");
// const discord = require("../bot-discord");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				let index = config.argument.split(/\s(.+)/)[0].toLowerCase();
				let text = config.argument.split(/\s(.+)/)[1];

				if (editQuote.versions[0].active && !isNaN(index)) {
					let quote = await Quote.findOne({ index: index });
					if (quote) {
						quote.text = text;
						await quote.save();
						result.push(
							"Quote " + index + " has been updated to: " + quote.text
						);
					} else {
						result.push("No quote number " + config.argument + " found");
					}
				} else if (
					editQuote.versions[1].active &&
					config.argument &&
					isNaN(index)
				) {
					let entries = await Quote.find({ text: text });
					if (entries) {
						let pularlity = entries.length > 1 ? "quotes" : "quote";

						result.push(
							entries.length + " " + pularlity + " found mentioning: " + text
						);

						let output;
						if (entries.length > 1) {
							output = "Indexes include: ";
							for (let i = 0; i < entries.length; i++) {
								output += entries[i].index + ", ";
							}
							result.push(output);
						} else {
							output =
								entries[0].index +
								" is the number of the quote you are looking to edit. Use !editquote " +
								entries[0].index;
						}
					} else {
						result.push("No quotes found including '" + text + "'");
					}
				}

				// let commandName = config.argument
				// 	.split(/\s(.+)/)[0]
				// 	.slice(1)
				// 	.toLowerCase();
				// let commandText = config.argument.split(/\s(.+)/)[1];

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
						"To edit a Command, you must include the Command name, and followed by the new Command output, Command must start with '!' '!editQuote !Yen Rose would really appreciate it if Yen would step on her'",
					]);
				}
			} else if (!config.isModUp) {
				result.push(["!editQuote command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To edit a quote, you must include the quote number like !editquote 69, or include a search string like !editquote uwu",
				]);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Edits an existing quote",
		usage: "!editQuote 69 What in the fuck?",
		usableBy: "mods",
		active: true,
	},
	{
		description:
			"Searches for a quote with this string, returns the index number of the quote, or quotes if multiple. Use above version to edit specific quote",
		usage: "!editQuote sit on my face",
		usableBy: "mods",
		active: true,
	},
];

const editQuote = new BaseCommand(commandResponse, versions);

function getPlurality(value, singular, plural) {
	let result;

	if (value > 1) {
		result = plural;
	} else {
		result = singular;
	}

	return result;
}

exports.command = editQuote;
