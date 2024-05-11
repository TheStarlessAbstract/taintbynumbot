const spotify = require("../../../../services/spotify");

const getCurrentlyPlaying = async function (config) {
	if (config.versionKey !== "getCurrentlyPlaying") return;
	let output;

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) {
		output = this.getProcessedOutputString(
			this.getOutput("noStream"),
			config.configMap
		);

		return output;
	}

	config.configMap.set("title", stream.title);

	output = this.getProcessedOutputString(
		this.getOutput("streamIsLive"),
		config.configMap
	);

	return output;
};

module.exports = getCurrentlyPlaying;
