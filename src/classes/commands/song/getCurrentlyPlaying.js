const spotify = require("../../../../services/spotify");
const { getStreamByUserId } = require("../../../services/twitch/streams");

const getCurrentlyPlaying = async function (config) {
	if (config.versionKey !== "getCurrentlyPlaying") return;
	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) {
		return this.getProcessedOutputString(
			this.getOutput("noStream"),
			config.configMap
		);
	}

	const response = await spotify.getCurrentPlaying(config.channelId);

	if (!response.playing) {
		return this.getProcessedOutputString(
			this.getOutput("noMusic"),
			config.configMap
		);
	}

	config.configMap.set("songTitle", response.title);
	config.configMap.set("artist", response.artist);
	config.configMap.set("spotifyUrl", response.url);

	return this.getProcessedOutputString(
		this.getOutput("listeningTo"),
		config.configMap
	);
};

module.exports = getCurrentlyPlaying;
