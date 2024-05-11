const { getStreamByUserId } = require("../../../services/twitch/streams");
const { updateChannelInfo } = require("../../../services/twitch/channels");

const setStreamTitle = async function (config) {
	if (config.versionKey !== "setStreamTitle") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	let outputType;
	const stream = await getStreamByUserId(config.channelId);
	if (!stream) outputType = "noStream";
	if (stream.title === config.argument) outputType = "existingTitle";
	if (outputType) {
		output = this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);

		return output;
	}

	outputType = "updateTitle";
	config.configMap.set("newTitle", config.argument);
	const data = { title: config.argument };
	const res = await updateChannelInfo(config.channelId, data);
	if (!res.success) outputType = "error";

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	return output;
};

module.exports = setStreamTitle;
