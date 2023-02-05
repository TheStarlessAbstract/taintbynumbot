const BaseCommand = require("../classes/base-command");

const Quote = require("../models/quote");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				let index = config.argument.split(/\s(.+)/)[0].toLowerCase();
				let text = config.argument.split(/\s(.+)/)[1];

				if (versions[0].active && !isNaN(index)) {
					let quote = await Quote.findOne({ index: index });
					if (quote) {
						result.push("Quote " + index + " was: " + quote.text);
						await quote.remove();
					} else {
						result.push("No quote number " + config.argument + " found");
					}
				} else if (versions[1].active && config.argument && isNaN(index)) {
					let entries = await Quote.find({
						text: { $regex: text, $options: "i" },
					});

					if (entries.length > 0) {
						let pularlity = entries.length > 1 ? "quotes" : "quote";

						result.push(
							entries.length + " " + pularlity + " found mentioning: " + text
						);

						let output;
						if (entries.length > 1) {
							output = "Indexes include: ";
							for (let i = 0; i < 5; i++) {
								output += entries[i].index + ", ";
							}
							result.push(output);
							if (entries.length > 5) {
								result.push(
									"There are more matches, maybe you could be more specific"
								);
							}
						} else {
							output =
								entries[0].index +
								" is the number of the quote you are looking to delete. Use !delquote " +
								entries[0].index;
						}
					} else {
						result.push("No quotes found including '" + text + "'");
					}
				}
			} else if (!config.isModUp) {
				result.push(["!delquote command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To delete a quote, you must include the quote number like !delquote 69, or include a search string like !delquote uwu",
				]);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Deletes an existing quote using specified quote number",
		usage: "!delquote 69",
		usableBy: "mods",
		active: true,
	},
	{
		description:
			"Searches for a quote that contains this string, returns the index number of the quote, or quotes if multiple. Use above version to delete specific quote",
		usage: "!delquote sit on my face",
		usableBy: "mods",
		active: true,
	},
];

const deleteQuote = new BaseCommand(commandResponse, versions);

exports.command = deleteQuote;
