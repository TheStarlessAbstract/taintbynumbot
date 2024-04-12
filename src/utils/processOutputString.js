/**
 * Replaces placeholders in the given output string with corresponding values from the map.
 * @param {string} outputString - The string containing placeholders to be replaced.
 * @param {Map} map - A Map object containing key-value pairs where the keys are the placeholders and the values are the replacements.
 * @returns {string} - The modified string with placeholders replaced by their corresponding values from the map.
 */
const processOutputString = (outputString, map) => {
	if (
		typeof outputString !== "string" ||
		!(map instanceof Map) ||
		!outputString
	)
		return;

	const regex = /\{([^}]+)\}/g;
	if (!regex.test(outputString)) return outputString;

	const updatedString = outputString.replace(regex, (match) =>
		map.has(match.slice(1, -1)) ? map.get(match.slice(1, -1)) : match
	);

	return updatedString;
};

module.exports = processOutputString;
