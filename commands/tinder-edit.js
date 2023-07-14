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
				let text = helper.getCommandArgumentKey(config.argument, 1);

				if (
					helper.isValuePresentAndNumber(index) &&
					helper.isValuePresentAndString(text)
				) {
					let tinderBio = await Tinder.findOne({ index: index });

					if (tinderBio) {
						if (tinderBio.text == text) {
							result.push("Tinder bio " + index + " already says: ");
							result.push(tinderBio.text);
						} else {
							result.push("Tinder bio " + index + " was: ");
							result.push(tinderBio.text);
							tinderBio.text = text;
							await tinderBio.save();

							result.push("Tinder bio " + index + " has been updated.");
						}
					} else {
						result.push("No Tinder bio " + index + " found");
					}
				} else {
					result.push(
						"!editTinder [bio number] [updated bio] - !editTinder 69 It's all about the booty"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				result.push("!editTinder is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push(
					"To edit a Tinder bio, use !editTinder [bio number] [updated bio]"
				);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Edits an existing Tinder bio",
		usage: "!editTinder 69 What in the fuck?",
		usableBy: "mods",
		active: true,
	},
];

const editTinder = new BaseCommand(commandResponse, versions);

exports.command = editTinder;
