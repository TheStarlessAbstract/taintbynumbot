const BaseCommand = require("../classes/base-command");

const Quote = require("../models/quote");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				let entries = await Quote.find({});
				const index = entries.length ? getNextIndex(entries) : 1;

				try {
					let created = await Quote.create({
						index: index,
						text: config.argument,
						addedBy: config.userInfo.displayName,
					});

					result.push(["Quote added"]);
				} catch (err) {
					if (err.code == 11000) {
						result.push("This quote has already been added");
					} else {
						console.log(err);
						result.push(
							"There was some problem adding this quote, and Starless should really sort this shit out."
						);
					}
				}
			} else if (!config.isModUp) {
				result.push(["!addquote command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a quote, you must include the quote after the command: '!addquote the mods totally never bully Starless'",
				]);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Saves a new, and totally out of context quote",
		usage: "!addquote Fuck fuck fuck fuck fuck",
		usableBy: "mods",
		active: true,
	},
];

const addQuote = new BaseCommand(commandResponse, versions);

function getNextIndex(array) {
	return array[array.length - 1].index + 1;
}

exports.command = addQuote;
