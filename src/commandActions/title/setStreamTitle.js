const { getStreamByUserId } = require("../../services/twitch/streams");
const { updateChannelInfo } = require("../../services/twitch/channels");

const setStreamTitle = async function (config) {
	if (!config.configMap) {
		console.error("no configMap for setStreamTitle");
		return;
	}

	if (!this.isPermitted(config.permitted))
		return this.getOutputString("notPermitted", config.configMap);

	const stream = await getStreamByUserId(config.channelId);
	if (!stream || !stream?.title)
		return this.getOutputString("noStream", config.configMap);
	if (stream.title === config.argument)
		return this.getOutputString("existingTitle", config.configMap);

	config.configMap.set("newTitle", config.argument);
	const data = { title: config.argument };
	const res = await updateChannelInfo(config.channelId, data);
	if (!res.success) return this.getOutputString("error", config.configMap);

	return this.getOutputString("updateTitle", config.configMap);
};

module.exports = setStreamTitle;
