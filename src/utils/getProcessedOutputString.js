const processOutputString = require("./processOutputString.js");

/**
 * Retrieves and processes an output string based on the provided channel, output reference, and configuration map.
 * @param {object} channel - The channel to retrieve the output string from.
 * @param {string} outputReference - The reference to the specific output.
 * @param {Map} configMap - A map of configuration options.
 * @returns {string|undefined} The processed output string, or undefined if the parameter types are invalid or if the configMap is empty.
 */
const getProcessedOutputString = (channel, outputReference, configMap) => {
	if (
		typeof channel !== "object" ||
		typeof outputReference !== "string" ||
		!(configMap instanceof Map) ||
		configMap.size === 0 ||
		!channel?.output
	)
		return;

	const output = channel.output;
	if (!output.has(outputReference)) return;
	const outputValue = output.get(outputReference);
	if (!outputValue || !outputValue.active || !outputValue.message) return;

	const message = outputValue.message;
	if (typeof message !== "string") return;

	const processedMessage = processOutputString(message, configMap);

	return processedMessage;
};

module.exports = getProcessedOutputString;
