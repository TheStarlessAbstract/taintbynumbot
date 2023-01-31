const kings = require("./kings");

let versions = [
	{
		description: "Resets !kings to a brand new deck",
		usage: "!kingsreset",
		usableBy: "mods",
		active: true,
	},
];

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
	};
};

function getVersions() {
	return versions;
}

function setVersionActive(element) {
	versions[element].active = !versions[element].active;
}

exports.getCommand = getCommand;
exports.getVersions = getVersions;
exports.setVersionActive = setVersionActive;
