const { getChannel } = require("./../../../controllers/channels");

const remaining = async function (config) {
	if (config.versionKey !== "remaining") return;

	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	const channel = getChannel(this.channelId);
	let game = channel.getCardGame(this.commandGroup);

	if (game) {
		const count = game.remainingCards();
		config.configMap.set("remaining", count);
		return this.getProcessedOutputString(
			this.getOutput("remaining"),
			config.configMap
		);
	}

	return this.getProcessedOutputString(
		this.getOutput("noGame"),
		config.configMap
	);
};

module.exports = remaining;
