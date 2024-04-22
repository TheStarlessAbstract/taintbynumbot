const commandTypes = () => {
	return {
		hydrate: require("../commands/hydrate"),
		text: require("../commands/text"),
	};
};

module.exports = commandTypes;
