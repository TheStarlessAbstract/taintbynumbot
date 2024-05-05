const commandActions = () => {
	return {
		// game: require("../classes/commands/game.js"),
		// text: require("../classes/commands/text.js"),
		// title: require("../classes/commands/title.js"),
		points: require("../classes/commands/points"),
		// points: require("../classes/commands/points.js"),
		// hydrate: require("../classes/commands/hydrate.js"),
		shoutout: require("../classes/commands/shoutout"),
		followage: require("../classes/commands/followage"),
	};
};

module.exports = commandActions;
