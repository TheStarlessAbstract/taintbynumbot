const BaseCommand = require("../classes/base-command");
const { getUserByName } = require("../services/twitch/users");
const { getChannelInfoById } = require("../services/twitch/channels");
const { shoutoutUser } = require("../services/twitch/chat");
const { getProcessedOutputString } = require("../utils");

const commandResponse = async (config) => {
	if (config.versionKey !== "stringArgument") return;
	let outputType;
	if (!config?.permitted) {
		outputType = "modsOnly";
	}

	const user = await getUserByName(config.username);
	if (!outputType && !user) {
		outputType = "notFound";
	}
	let channel;
	if (!outputType) {
		channel = await getChannelInfoById(user.id);
	}

	if (!outputType && (!channel || !channel.gameName)) {
		outputType = "shoutoutNoStreams";
	}

	if (!outputType) {
		outputType = "shoutoutAndStreams";
	}

	const output = getProcessedOutputString(
		config.output.get(outputType),
		config.configMap
	);

	if (user) {
		await shoutoutUser(config.channelId, user.id);
	}
	return output;
};

const command = new BaseCommand(commandResponse);

module.exports = command;
