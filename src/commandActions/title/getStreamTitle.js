const { getStreamByUserId } = require("../../services/twitch/streams");

const getStreamTitle = async function (config) {
	const configValidation = this.validateConfig(config);
	if (!configValidation) return;
	if (!configValidation.valid) return configValidation.output;

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) return this.getOutputString("noStream", config.configMap);

	config.configMap.set("title", stream.title);

	return this.getOutputString("streamIsLive", config.configMap);
};

module.exports = getStreamTitle;
