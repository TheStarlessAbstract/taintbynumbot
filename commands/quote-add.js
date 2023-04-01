const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const Quote = require("../models/quote");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				helper.isValidModeratorOrStreamer(config) &&
				helper.isValuePresentAndString(config.argument)
			) {
				let quoteText = config.argument;

				let existingQuote = await Quote.findOne({ text: quoteText });

				if (existingQuote != null) {
					result.push("This Quote has already been added");
				} else {
					let entry = await Quote.findOne()
						.sort({ index: -1 })
						.select("index")
						.exec();

					let index;
					if (entry) {
						index = entry.index + 1;
					} else {
						index = 1;
					}

					await Quote.create({
						index: index,
						text: quoteText,
						addedBy: config.userInfo.displayName,
					});

					result.push("Quote added: " + quoteText);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!addQuote is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push("To add a Quote use !addQuote [quote text]");
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

exports.command = addQuote;
