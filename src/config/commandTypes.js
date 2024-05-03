const commandTypes = () => {
	return {
		hydrate: require("../classes/commands/hydrate.js"),
		text: require("../classes/commands/text.js"),
		followage: require("../classes/commands/followage"),
		shoutout: require("../classes/commands/shoutout"),
		// game: require("../classes/commands/game"),
	};
};

module.exports = commandTypes;
