const commandTypes = () => {
	return {
		game: require("../classes/commands/game.js"),
		text: require("../classes/commands/text.js"),
		title: require("../classes/commands/title.js"),
		hydrate: require("../classes/commands/hydrate.js"),
		shoutout: require("../classes/commands/shoutout.js"),
		followage: require("../classes/commands/followage.js"),
	};
};

module.exports = commandTypes;
