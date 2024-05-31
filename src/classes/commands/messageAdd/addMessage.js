const { getChannel } = require("../../../services/channels/channels");
const { findOne } = require("../../../queries/users");

const addMessage = async function (config) {
	if (config.versionKey !== "addMessage") return;

	let outputType = "";
	if (!config?.permitted) outputType = "notPermitted";
	if (!outputType && !config.argument) outputType = "noMessage";

	if (outputType)
		this.getProcessedOutputString(this.getOutput(outputType), config.configMap);

	const channel = getChannel(config.channelId);
	if (!channel) return;

	// move existing check to channel class, called from addMessage, or function performed there return from addMessage {object, err}
	const messageExists = channel.checkMessageExists(config.argument);

	if (messageExists)
		return this.getProcessedOutputString(
			this.getOutput("messageExists"),
			config.configMap
		);

	const message = channel.addMessage(config.argument, config.username);
	const user = await findOne({ channelId: config.channelId });

	user.messages.push(message);
	await user.save();

	return this.getProcessedOutputString(
		this.getOutput("added"),
		config.configMap
	);
};

module.exports = addMessage;
