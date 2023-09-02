const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const Title = require("../models/title");

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
					let title = await Title.findOne({ index: index });

					if (title) {
						if (title.text == text) {
							result.push("ModAbuse " + index + " already says: " + title.text);
						} else if (title.text != text) {
							result.push(
								"ModAbuse " +
									index +
									" has been updated - it previously was: " +
									title.text
							);

							title.text = text;
							await title.save();
						}
					} else {
						result.push("No ModAbuse " + index + " found");
					}
				} else {
					result.push(
						"!editModAbuse [index] [updated text] - !editModAbuse 69 It's all about the booty"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				result.push("!editModAbuse is for Mods only");
			} else if (!helper.isValuePresentAndString(config.argument)) {
				result.push(
					"To edit a ModAbuse, use !editModAbuse [index] [updated text]"
				);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Edits an existing ModAbuse",
		usage: "!editmodabuse 69 What in the fuck?",
		usableBy: "mods",
		active: true,
	},
];

const editModAbuse = new BaseCommand(commandResponse, versions);

exports.command = editModAbuse;
