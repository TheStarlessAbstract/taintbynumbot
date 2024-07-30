const { splitArgs } = require("../../../utils/modify");
const { findOne } = require("./../../../queries/commands");
const { getChannel } = require("./../../../controllers/channels");

const editCommand = async function (config) {
	if (config.versionKey !== "editCommand") return;
	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	if (!config.argument.startsWith("!"))
		return this.getProcessedOutputString(
			this.getOutput("noPrefix"),
			config.configMap
		);
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
		return this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);
	}
	commandOutput.message = commandUpdate;

	const channel = getChannel(this.channelId);
	channel.editTextCommand(name, commandUpdate);

	await command.save();

	return this.getProcessedOutputString(
		this.getOutput("edited"),
		config.configMap
	);
};

module.exports = editCommand;
