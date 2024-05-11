const { getUserByName } = require("../../../services/twitch/users");
const { getChannelInfoById } = require("../../../services/twitch/channels");
const { shoutoutUser } = require("../../../services/twitch/chat");

const giveUserShoutout = async function (config) {
	if (config.versionKey !== "giveUserShoutout") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	let username = config.argument;
	if (username.startsWith("@")) {
		username = username.substring(1);
	}

	config.configMap.set("shoutee", username);
	const user = await getUserByName(username);

	if (!user) {
		output = this.getProcessedOutputString(
			this.getOutput("notFound"),
			config.configMap
		);
		return output;
	}

	// confirm userid has channel, checks last streamed game
	const channel = await getChannelInfoById(user.id);
	let outputType = "shoutoutNoStreams";
	if (channel?.gameName) {
		config.configMap.set("gameName", channel?.gameName);
		outputType = "shoutoutAndStreams";
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	if (channel) {
		await shoutoutUser(config.channelId, user.id);
	}
	return output;
};

module.exports = giveUserShoutout;
