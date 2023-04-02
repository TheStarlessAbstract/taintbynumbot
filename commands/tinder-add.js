const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const Tinder = require("../models/tinder");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (
				helper.isValidModeratorOrStreamer(config) &&
				helper.isValuePresentAndString(config.argument)
			) {
				let tinderText = config.argument;
				let existingTinder = await Tinder.findOne({ text: tinderText });

				if (existingTinder != null) {
					result.push("This Tinder bio has already been added");
				} else {
					let entry = await Tinder.findOne()
						.sort({ index: -1 })
						.select("index")
						.exec();

					let index;
					if (entry) {
						index = entry.index + 1;
					} else {
						index = 1;
					}

					await Tinder.create({
						index: index,
						text: tinderText,
						addedBy: config.userInfo.displayName,
					});

					result.push("New Tinder bio added: " + tinderText);
				}
			} else if (!helper.isValidModeratorOrStreamer(config)) {
				result.push("!addTinder is for Mods only");
			} else if (!config.argument) {
				result.push("To add a Tinder bio use !addTinder [tinder bio]");
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "To save Starless' new Tinder bio",
		usage:
			"!addTinder As long as my face is around, you will always have some place to sit",
		usableBy: "mods",
		active: true,
	},
];

const addTinder = new BaseCommand(commandResponse, versions);

exports.command = addTinder;
