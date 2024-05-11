const commandActions = () => {
	return {
		game: require("../classes/commands/game"),
		// song: require("../classes/commands/song"),
		list: require("../classes/commands/list"),
		text: require("../classes/commands/text"),
		title: require("../classes/commands/title"),
		points: require("../classes/commands/points"),
		hydrate: require("../classes/commands/hydrate"),
		shoutout: require("../classes/commands/shoutout"),
		followage: require("../classes/commands/followage"),
	};
};

module.exports = commandActions;
