const BaseCommand = require("./baseCommand.js");
const { getUserByName } = require("../../services/twitch/users");
const { getChannelInfoById } = require("../../services/twitch/channels");
const { shoutoutUser } = require("../../services/twitch/chat");

async function action(config) {
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

	const output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	if (!output) outputType = "error";

	if (user) {
		await shoutoutUser(config.channelId, user.id);
	}
	return output;
}

class Shoutout extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	action = action.bind(this);
}

module.exports = Shoutout;
