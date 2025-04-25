const processOutputString = (output, variableMap) => {
	const regex = /\{([^}]+)\}/g;
	if (!regex.test(output)) return output;
	console.log(output);
	console.log(variableMap);
	const processedOutput = output.replace(regex, (match) =>
		variableMap.has(match.slice(1, -1))
			? variableMap.get(match.slice(1, -1))
			: match
	);
	return processedOutput;
};

module.exports = processOutputString;
