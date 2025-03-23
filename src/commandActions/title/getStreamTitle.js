const { getStreamByUserId } = require("../../services/twitch/streams");

const getStreamTitle = async function (config) {
	if (!config.configMap) {
		console.error("no configMap for getStreamTitle");
		return;
	}

	if (!this.isPermitted(config.permitted))
		return this.getOutputString("notPermitted", config.configMap);

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) return this.getOutputString("noStream", config.configMap);

	config.configMap.set("title", stream.title);

	return this.getOutputString("streamIsLive", config.configMap);
};

module.exports = getStreamTitle;
