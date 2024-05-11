const { getStreamByUserId } = require("../../../services/twitch/streams");

const getStreamGame = async function (config) {
	if (config.versionKey !== "getStreamGame") return;
	let output;

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) {
		output = this.getProcessedOutputString(
			this.getOutput("noStream"),
			config.configMap
		);

		return output;
	}

	config.configMap.set("gameName", stream.gameName);

	output = this.getProcessedOutputString(
		this.getOutput("streamIsLive"),
		config.configMap
	);

	return output;
};

module.exports = getStreamGame;
