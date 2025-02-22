const spotify = require("../../services/spotify/spotify");
const { getStreamByUserId } = require("../../services/twitch/streams");

const getCurrentlyPlaying = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) return this.getOutputString("noStream", config.configMap);

	const response = await spotify.getCurrentPlaying(config.channelId);

	if (!response.playing)
		return this.getOutputString("noMusic", config.configMap);

	config.configMap.set("songTitle", response.title);
	config.configMap.set("artist", response.artist);
	config.configMap.set("spotifyUrl", response.url);

	return this.getOutputString("listeningTo", config.configMap);
};

module.exports = getCurrentlyPlaying;
