const BotCommand = require("../../classes/bot-command");
const Helper = require("../../classes/helper");
const CommandNew = require("../../models/commandnew");
const helper = new Helper();

const commandResponse = async (config) => {
	if (helper.isStreamer(config)) return;

	if (!command.getChannel[config.channelId]) {
		const userCommand = await CommandNew.findOne({
			streamerId: config.channelId,
			defaultName: "lurk",
		});
		if (!userCommand) return;

		command.addChannel(config.channelId, {
			output: userCommand.output,
			versions: userCommand.versions,
		});
	}

	const commandConfigMap = helper.getCommandConfigMap(config);

	return helper.getProcessedOutputString(
		command.getChannel(config.channelId),
		"isLurking",
		commandConfigMap
	);
};

const command = new BotCommand(commandResponse);

module.exports = command;
