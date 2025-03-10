const { splitArgs } = require("../../utils/modify");
const { findOne } = require("../../queries/commands");
const { getChannel } = require("../../controllers/channels");

const editCommand = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	if (!config.argument.startsWith("!"))
		return this.getOutputString("noPrefix", config.configMap);
	const { first: name, second: commandUpdate } = splitArgs(config.argument, 1);

	const command = await findOne({
		channelId: config.channelId,
		chatName: name,
	});

	let outputType;
	const commandOutput = command.output.get("text");
	if (!command) outputType = "notFound";
	else if (command.type !== "text") outputType = "notEditable";
	else if (commandOutput.text === commandUpdate) outputType = "currentText";
	if (outputType) {
		return this.getOutputString(outputType, config.configMap);
	}
	commandOutput.message = commandUpdate;

	const channel = getChannel(this.channelId);
	channel.editTextCommand(name, commandUpdate);

	await command.save();

	return this.getOutputString("edited", config.configMap);
};

module.exports = editCommand;
