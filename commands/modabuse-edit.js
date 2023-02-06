const BaseCommand = require("../classes/base-command");

const Title = require("../models/title");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				let index = config.argument.split(/\s(.+)/)[0].toLowerCase();
				let text;

				if (isNaN(index)) {
					text = config.argument;
				} else {
					text = config.argument.split(/\s(.+)/)[1];
				}

				if (versions[0].active && !isNaN(index)) {
					let quote = await Title.findOne({ index: index });
					if (quote) {
						result.push("ModAbuse " + index + " was: " + quote.text);
						quote.text = text;
						await quote.save();

						result.push(
							"ModAbuse " + index + " has been updated to: " + quote.text
						);
					} else {
						result.push("No ModAbuse number " + config.argument + " found");
					}
				} else if (versions[1].active && config.argument && isNaN(index)) {
					let entries = await Title.find({
						text: { $regex: text, $options: "i" },
					});

					if (entries.length > 0) {
						let pularlity = entries.length > 1 ? "ModAbuses" : "ModAbuse";

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
								" is the number of the ModAbuse you are looking to edit. Use !editmodabuse " +
								entries[0].index;

							result.push(output);
						}
					} else {
						result.push("No ModAbuse found including '" + text + "'");
					}
				}
			} else if (!config.isModUp) {
				result.push("!editmodabuse command is for Mods only");
			} else if (!config.argument) {
				result.push(
					"To edit a ModAbuse, you must include the ModAbuse number like !editmodabuse 69, or include a search string like !editmodabuse uwu"
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
	{
		description:
			"Searches for a ModAbuse with this string, returns the index number of the ModAbuse, or quotes if multiple. Use above version to edit specific ModAbuse",
		usage: "!editmodabuse sit on my face",
		usableBy: "mods",
		active: true,
	},
];

const editModAbuse = new BaseCommand(commandResponse, versions);

exports.command = editModAbuse;
