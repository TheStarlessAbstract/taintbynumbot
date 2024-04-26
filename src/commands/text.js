const BaseCommand = require("../classes/base-command");
const { getProcessedOutputString } = require("../utils");

/**
 * Processes the command response based on the provided configuration.
 * @param {Object} config - The configuration object containing the version and output information of the command.
 * @returns {string} - The processed output string of the command.
 */
const commandResponse = (config) => {
	if (config.versionKey !== "noArgument") return;

	const output = getProcessedOutputString(
		config.output.get("text"),
		config.configMap
	);

	if (!output) return;
	return output;
};

const commandType = new BaseCommand(commandResponse);

module.exports = commandType;
