const { getChannel } = require("../../services/channels/channels");
const { findOne } = require("../../queries/users");

const addMessage = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	let outputType;
	if (!config.argument) outputType = "noMessage";

	if (outputType) this.getOutputString(outputType, config.configMap);

	const channel = getChannel(config.channelId);
	if (!channel) return;

	const messageExists = channel.checkMessageExists(config.argument);
	if (messageExists)
		return this.getOutputString("messageExists", config.configMap);

	const message = channel.addMessage(config.argument, config.username);
	const user = await findOne({ channelId: config.channelId });

	user.messages.push(message);
	await user.save();

	return this.getOutputString("added", config.configMap);
};

module.exports = addMessage;
