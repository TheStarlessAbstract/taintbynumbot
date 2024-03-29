const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const kings = require("./kings");

const helper = new Helper();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (helper.isValidModeratorOrStreamer(config.userInfo)) {
				await kings.resetKings();
				let cardsToDraw = kings.getCardsToDrawLength();

				result.push(
					"A new game of Kings has been dealt, with " + cardsToDraw + " cards!"
				);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Resets !kings to a brand new deck",
		usage: "!kingsreset",
		usableBy: "mods",
		active: true,
	},
];

const kingsReset = new BaseCommand(commandResponse, versions);

exports.command = kingsReset;
