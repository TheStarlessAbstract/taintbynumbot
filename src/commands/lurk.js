const BotCommand = require("../classes/bot-command");
const {
	getChatCommandConfigMap,
	getProcessedOutputString,
} = require("../utils");

/**
 * Processes the command response based on the provided configuration.
 * @param {Object} config - The configuration object containing the version and output information of the command.
 * @returns {Promise<string>} - The processed output string of the command.
 */
const commandResponse = async (config) => {
	//{version: string, output: {map}}
	const commandDetails = await commandType.checkCommandCanRun(config);
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
