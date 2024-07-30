const { getChannel } = require("../../../services/channels/channels");
const { updateOne } = require("../../../queries/users");

const getUserPoints = async function (config) {
	if (config.versionKey !== "deleteMessage") return;
	let outputType;

	if (!config?.permitted) outputType = "notPermitted";
	if (!outputType && !config.argument) outputType = "noArgument";
	if (outputType)
		return this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);

	config.configMap.set("index", config.argument);

	const res = await updateOne(
		{ channelId: config.channelId, "messages.index": config.argument },
		{ $pull: { messages: { index: config.argument } } }
	);

	outputType = "deleted";
	if (res.matchedCount === 0) outputType = "notFound";
	if (!res.acknowledged) outputType = "error";
	else {
		const channel = getChannel(config.channelId);
		channel.deleteMessageByIndex(config.argument);
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	return output;
};

module.exports = getUserPoints;
