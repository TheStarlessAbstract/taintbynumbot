const { deleteOne } = require("./../../../queries/commands");
const { getChannel } = require("./../../../controllers/channels");

const deleteCommand = async function (config) {
	if (config.versionKey !== "deleteCommand") return;
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
	const name = config.argument.slice(1);

	const command = await deleteOne({
		channelId: this.channelId,
		chatName: name,
	});

	if (command.deletedCount === 0)
		return this.getProcessedOutputString(
			this.getOutput("notDeleted"),
			config.configMap
		);

	const channel = getChannel(this.channelId);
	channel.deleteCommand(name);

	return this.getProcessedOutputString(
		this.getOutput("deleted"),
		config.configMap
	);
};

module.exports = deleteCommand;
