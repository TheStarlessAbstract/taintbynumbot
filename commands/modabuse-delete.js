const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const Title = require("../models/title");

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

				if (helper.isValuePresentAndNumber(index)) {
					let title = await Title.findOne({ index: index });
					if (title) {
						result.push("ModAbuse  deleted - " + index + " was: " + title.text);
						await title.remove();
					} else {
						result.push("No ModAbuse " + config.argument + " found");
					}
				} else {
					result.push(
						"!delModAbuse [index] - index is a number - !delModAbuse 69"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!delModAbuse is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push("To delete a ModAbuse, use !delModAbuse ![index]");
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Deletes an existing ModAbuse using specified index number",
		usage: "!delModAbuse 69",
		usableBy: "mods",
		active: true,
	},
];

const deleteQuote = new BaseCommand(commandResponse, versions);

exports.command = deleteQuote;
