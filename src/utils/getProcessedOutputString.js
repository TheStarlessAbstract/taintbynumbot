const processOutputString = require("./processOutputString.js");

/**
 * Retrieves and processes an output string based on the provided channel, output reference, and configuration map.
 * @param {object} channel - The channel to retrieve the output string from.
 * @param {string} outputReference - The reference to the specific output.
 * @param {Map} configMap - A map of configuration options.
 * @returns {string|undefined} The processed output string, or undefined if the parameter types are invalid or if the configMap is empty.
 */
const getProcessedOutputString = (output, configMap) => {
	if (
		typeof output !== "object" ||
		!(configMap instanceof Map) ||
		configMap.size === 0
	)
		return;

	if (!output || !output.active || !output.message) return;

	const message = output.message;
	if (typeof message !== "string") return;

	const processedMessage = processOutputString(message, configMap);

	return processedMessage;
};

module.exports = getProcessedOutputString;
