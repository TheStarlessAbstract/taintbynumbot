const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const Tinder = require("../models/tinder");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				helper.isValidModeratorOrStreamer(config.userInfo) &&
				helper.isValuePresentAndString(config.argument)
			) {
				let index = helper.getCommandArgumentKey(config.argument, 0);

				if (helper.isValuePresentAndNumber(index)) {
					let tinder = await Tinder.findOne({ index: index });
					if (tinder) {
						await tinder.deleteOne();
						result.push("Tinder bio deleted - " + index + " was: ");
						result.push(tinder.text);
					} else {
						result.push("No Tinder bio " + config.argument + " found");
					}
				} else {
					result.push("!delTinder [bio number] - !delTinder 69");
				}
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				result.push("!delTinder is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push("To delete a Tinder bio, use !delTinder [bio number]");
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Deletes an existing Tinder bio using specified bio number",
		usage: "!delTinder 69",
		usableBy: "mods",
		active: true,
	},
];

const deleteTinder = new BaseCommand(commandResponse, versions);

exports.command = deleteTinder;
