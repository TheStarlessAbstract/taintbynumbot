const { getStreamByUserId } = require("../../../services/twitch/streams");

const getCounterForCategory = async function (config) {
	if (config.versionKey !== "getCounterForCategory") return;
	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}
	let game = config.argument;

	if (!config.argument) {
		const stream = await getStreamByUserId(config.channelId);
		if (!stream)
			return this.getProcessedOutputString(
				this.getOutput("channelNotLive"),
				config.configMap
			);
		game = stream.gameName;
	}

	const count = await this.count(game);
	config.configMap.set("total", count);

	return this.getProcessedOutputString(
		this.getOutput("total"),
		config.configMap
	);
};

module.exports = getCounterForCategory;
