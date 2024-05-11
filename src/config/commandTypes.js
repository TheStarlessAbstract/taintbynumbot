const commandTypes = () => {
	return {
		game: require("../classes/commands/game/class"),
		// song: require("../classes/commands/song/class"),
		list: require("../classes/commands/list/class"),
		text: require("../classes/commands/text/class"),
		title: require("../classes/commands/title/class"),
		points: require("../classes/commands/points/class"),
		hydrate: require("../classes/commands/hydrate/class"),
		shoutout: require("../classes/commands/shoutout/class"),
		followage: require("../classes/commands/followage/class"),
	};
};

module.exports = commandTypes;
