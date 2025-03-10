const { getChannel } = require("../../controllers/channels");

const remaining = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	const channel = getChannel(this.channelId);
	let game = channel.getCardGame(this.commandGroup);

	if (game) {
		const count = game.remainingCards();
		config.configMap.set("remaining", count);
		return this.getOutputString("remaining", config.configMap);
	}

	return this.getOutputString("noGame", config.configMap);
};

module.exports = remaining;
