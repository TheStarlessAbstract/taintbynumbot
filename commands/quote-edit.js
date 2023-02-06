const BaseCommand = require("../classes/base-command");

const Quote = require("../models/quote");

function IsValidModeratorOrStreamer(config)
{
	return config.isBroadcaster || config.isModUp;
}

function IsArgumentPresentAndString(config)
{
	return config.argument != undefined && typeof config.argument === 'string' && config.argument != "";
}

function GetCommandArgumentKey(config, index)
{
	if(IsArgumentPresentAndString(config))
	{
		var splitData = config.argument.split(/\s(.+)/);
		if(index == 0)
		{
			return splitData[index].toLowerCase();
		}
		else if(splitData[index] != undefined)
		{
			return splitData[index];
		}
	}
	return "";
}

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (IsValidModeratorOrStreamer(config) && IsArgumentPresentAndString(config)) {
				let index = GetCommandArgumentKey(config,0);
				let text = GetCommandArgumentKey(config,1);

				if (versions[0].active && !isNaN(index)) {
					let quote = await Quote.findOne({ index: index });
					if (quote) {
						result.push("Quote " + index + " was: " + quote.text);
						quote.text = text;
						await quote.save();

						result.push(
							"Quote " + index + " has been updated to: " + quote.text
						);
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
								" is the number of the quote you are looking to edit. Use !editquote " +
								entries[0].index;
						}
					} else {
						result.push("No quotes found including '" + text + "'");
					}
				}
			} else if (!config.isModUp) {
				result.push("!editQuote command is for Mods only");
			} else if (!config.argument) {
				result.push(
					"To edit a quote, you must include the quote number like !editquote 69, or include a search string like !editquote uwu"
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
	{
		description:
			"Searches for a quote with this string, returns the index number of the quote, or quotes if multiple. Use above version to edit specific quote",
		usage: "!editQuote sit on my face",
		usableBy: "mods",
		active: true,
	},
];

const editQuote = new BaseCommand(commandResponse, versions);

exports.command = editQuote;
exports.IsValidModeratorOrStreamer = IsValidModeratorOrStreamer;
exports.IsArgumentPresentAndString = IsArgumentPresentAndString;
exports.GetCommandArgumentKey = GetCommandArgumentKey;
