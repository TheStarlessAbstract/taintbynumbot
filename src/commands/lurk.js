const BotCommand = require("../classes/bot-command");
const {
	getChatCommandConfigMap,
	getProcessedOutputString,
} = require("../utils");

const commandResponse = async (config) => {
	const channel = command.checkCommandCanRun(config);
	if (!channel) return;

	const chatCommandConfigMap = getChatCommandConfigMap(config);
	if (!chatCommandConfigMap) return;

	if (channel.has("noArgument")) {
		const output = getProcessedOutputString(
			channel.output.get("noArgument"),
			"isLurking",
			chatCommandConfigMap
		);
		if (!output) return;

		return output;
	}
	return;
};

const command = new BotCommand(commandResponse);
module.exports = command;
