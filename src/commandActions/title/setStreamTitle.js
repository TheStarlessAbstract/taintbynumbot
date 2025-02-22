const { getStreamByUserId } = require("../../services/twitch/streams");
const { updateChannelInfo } = require("../../services/twitch/channels");

const setStreamTitle = async function (config) {
	if (!this.isPermitted(config.permitted))
		return this.getOutputString("notPermitted", config.configMap);

	let outputType;
	const stream = await getStreamByUserId(config.channelId);
	if (!stream) outputType = "noStream";
	if (stream.title === config.argument) outputType = "existingTitle";
	if (outputType) return this.getOutputString(outputType, config.configMap);

	outputType = "updateTitle";
	config.configMap.set("newTitle", config.argument);
	const data = { title: config.argument };
	const res = await updateChannelInfo(config.channelId, data);
	if (!res.success) outputType = "error";

	return this.getOutputString(outputType, config.configMap);
};

module.exports = setStreamTitle;
