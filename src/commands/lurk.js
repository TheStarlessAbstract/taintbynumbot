const BotCommand = require("../classes/bot-command");
const {
	getChatCommandConfigMap,
	getProcessedOutputString,
} = require("../utils");

const commandResponse = async (config) => {
	const version = command.checkCommandCanRun(config);
	if (!version) return;

	const chatCommandConfigMap = getChatCommandConfigMap(config);
	if (!chatCommandConfigMap) return;

	if (version == "noArgument") {
		const output = getProcessedOutputString(
			channel,
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
