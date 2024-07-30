const { getChannel } = require("../../../services/channels/channels");
const { splitArgs } = require("../../../utils/modify");
const { updateOne } = require("../../../queries/users");

const editMessage = async function (config) {
	if (config.versionKey !== "editMessage") return;
	let output;
	let outputType = "";
	if (!config?.permitted) outputType = "notPermitted";
	if (!outputType && !config.argument) outputType = "noArgument";
	if (outputType)
		return this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);

	const { first: index, second: textUpdate } = splitArgs(config.argument, 0);
	config.configMap.set("messageIndex", index);
	const channel = getChannel(config.channelId);
	if (!channel) return;
	const message = channel.getMessageByIndex(index);
	if (!message)
		return this.getProcessedOutputString(
			this.getOutput("doesNotExist"),
			config.configMap
		);
	const existingMessage = channel.checkMessageExists(textUpdate);
	if (existingMessage?.index === index) outputType = "currentMessageText";
	else if (existingMessage) outputType = "messageExists";
	if (outputType)
		return this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);

	const res = await updateOne(
		{ channelId: config.channelId, "messages.index": index },
		{ $set: { "messages.$.text": textUpdate } }
	);

	outputType = "updated";
	if (!res.acknowledged) outputType = "error";
	else message.text = textUpdate;

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	return output;
};

module.exports = editMessage;
