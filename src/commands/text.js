const BotCommand = require("../classes/bot-command");
const { getProcessedOutputString } = require("../utils");

/**
 * Processes the command response based on the provided configuration.
 * @param {Object} config - The configuration object containing the version and output information of the command.
 * @returns {Promise<string>} - The processed output string of the command.
 */
const commandResponse = async (config) => {
	if (config.versionKey !== "noArgument") return;

	const output = getProcessedOutputString(
		config.output.get("text"),
		config.configMap
	);

	if (!output) return;
	return output;
};

const commandType = new BotCommand(commandResponse);
module.exports = commandType;
