const { getStreamByUserId } = require("../../../services/twitch/streams");

const getStreamTitle = async function (config) {
	if (config.versionKey !== "getStreamTitle") return;
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

module.exports = getStreamTitle;
