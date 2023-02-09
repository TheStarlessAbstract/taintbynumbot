const BaseCommand = require("../classes/base-command");

const kings = require("./kings");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (versions[0].active && config.isModUp) {
				kings.resetKings();
				let cardsToDraw = kings.getCardsToDraw();

				result.push(
					"A new game of Kings has been dealt, with " +
						cardsToDraw.length +
						" cards!"
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
