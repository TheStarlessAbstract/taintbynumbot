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
				let index = helper.getCommandArgumentKey(config, 0);
				let text = helper.getCommandArgumentKey(config, 1);

				if (
					helper.isValuePresentAndNumber(index) &&
					helper.isValuePresentAndString(text)
				) {
					let quote = await Quote.findOne({ index: index });

					if (quote) {
						if (quote.text == text) {
							result.push("Quote " + index + " already says: " + quote.text);
						} else {
							result.push("Quote " + index + " was: " + quote.text);
							quote.text = text;
							await quote.save();

							result.push(
								"Quote " + index + " has been updated to: " + quote.text
							);
						}
					} else {
						result.push("No Quote " + index + " found");
					}
				} else {
					result.push(
						"!editQuote [quote number] [updated text] - !editModAbuse 69 It's all about the booty"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!editQuote is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push(
					"To edit a Quote, use !editQuote [quote number] [quote text]"
				);
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
];

const editQuote = new BaseCommand(commandResponse, versions);

exports.command = editQuote;
