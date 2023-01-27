const kings = require("./kings");

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp) {
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
		versions: [
			{
				description: "Resets !kings to a brand new deck",
				usage: "!kingsreset",
				usableBy: "mods",
			},
		],
	};
};

exports.getCommand = getCommand;
