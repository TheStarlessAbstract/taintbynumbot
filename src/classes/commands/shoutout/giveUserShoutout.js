const { getUserByName } = require("../../../services/twitch/users");
const { getChannelInfoById } = require("../../../services/twitch/channels");
const { shoutoutUser } = require("../../../services/twitch/chat");

const giveUserShoutout = async function (config) {
	if (config.versionKey !== "giveUserShoutout") return;
	let outputType;
	if (!config?.permitted) {
		outputType = "modsOnly";

		output = this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);

		return output;
	}

	config.configMap.set("shoutee", config.argument);
	const user = await getUserByName(config.argument);

	if (!user) {
		outputType = "notFound";
		output = this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);

		return output;
	}

	const channel = await getChannelInfoById(user.id);
	outputType = "shoutoutAndStreams";
	if (!channel || !channel.gameName) {
		outputType = "shoutoutNoStreams";
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
