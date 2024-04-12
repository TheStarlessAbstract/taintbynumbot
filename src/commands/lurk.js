const BotCommand = require("../classes/bot-command");
const {
	getChatCommandConfigMap,
	getProcessedOutputString,
} = require("../utils");

const commandResponse = async (config) => {
	//{version: string, output: {map}}
	const commandDetails = commandType.checkCommandCanRun(config);
	if (!commandDetails) return;

	const chatCommandConfigMap = getChatCommandConfigMap(config);
	if (!chatCommandConfigMap) return;

	if (commandDetails.version !== "noArgument") return;

	const output = getProcessedOutputString(
		commandDetails.output.get("isLurking"),
		chatCommandConfigMap
	);
	if (!output) return;

	return output;
};

const commandType = new BotCommand(commandResponse);
module.exports = commandType;
