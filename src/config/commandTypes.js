const commandTypes = () => {
	return {
		hydrate: require("../commands/hydrate"),
		text: require("../commands/text"),
		followage: require("../commands/followage"),
		shoutout: require("../commands/shoutout"),
		game: require("../commands/game"),
	};
};

module.exports = commandTypes;
