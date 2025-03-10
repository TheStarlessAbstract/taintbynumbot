const { getStreamByUserId } = require("../../services/twitch/streams");

const getStreamGame = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) return this.getOutputString("noStream", config.configMap);

	config.configMap.set("gameName", stream.gameName);

	return this.getOutputString("streamIsLive", config.configMap);
};

module.exports = getStreamGame;
