const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const Quote = require("../models/quote");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				helper.isValidModeratorOrStreamer(config.userInfo) &&
				helper.isValuePresentAndString(config.argument)
			) {
				let quoteIndex = config.argument;

				if (!isNaN(quoteIndex)) {
					// let quote = await Quote.deleteOne({ index: quoteIndex });
					let quote = await Quote.findOne({ index: quoteIndex });
					if (quote) {
						let deletion = await Quote.deleteOne({ index: quoteIndex });
						if (deletion.deletedCount == 1) {
							result.push("Quote " + quoteIndex + " was: " + quote.text);
						} else {
							result.push("Quote " + quoteIndex + " was not deleted");
						}
					} else {
						result.push("No Quote " + quoteIndex + " found");
					}
				} else {
					result.push("To delete a Quote, use !delQuote [quote number]");
				}
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				result.push("!delQuote is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push("To delete a Quote, use !delQuote [quote number]");
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
];

const deleteQuote = new BaseCommand(commandResponse, versions);

exports.command = deleteQuote;
