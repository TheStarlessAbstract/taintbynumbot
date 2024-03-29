function getProcessedOutputString(channel, outputReference, configMap) {
	let outputString = getOutputString(channel, outputReference);
	if (!outputString) return;

	let processedOutputString = processOutputString(outputString, configMap);
	return processedOutputString;
}

module.exports = getProcessedOutputString;

function getOutputString(channel, outputReference) {
	let outputMap = channel?.output;
	if (
		!outputMap ||
		!(outputMap instanceof Map) ||
		!outputReference ||
		!(typeof outputReference == "string")
	)
		return;

	let output = "";
	if (!outputMap.get(outputReference).active) return;

	output = outputMap.get(outputReference).message;
	return output;
}

function processOutputString(outputString, map) {
	if (
		!outputString ||
		!(typeof outputString == "string") ||
		!map ||
		!(map instanceof Map)
	)
		return;

	const regex = /\{[^}]*\}/g;
	const keysInOutputString = outputString.match(regex);
	if (!keysInOutputString) return outputString;

	const uniqueKeysInOutputString = [...new Set(keysInOutputString)];
	const cleanedArrayOfKeys = removeFirstAndLastCharacterStringArray(
		uniqueKeysInOutputString
	);

	for (let i = 0; i < cleanedArrayOfKeys.length; i++) {
		outputString = outputString.replaceAll(
			`{${cleanedArrayOfKeys[i]}}`,
			map.get(cleanedArrayOfKeys[i])
		);
	}

	return outputString;
}

function removeFirstAndLastCharacterStringArray(arrayOfStrings) {
	return arrayOfStrings.map((string) => string.substring(1, string.length - 1));
}
