async function sayToChat(config) {
	const validation = this.validateConfig(config);
	if (validation?.error) {
		console.error(validation.error);
		return undefined;
	}
	if (!validation.valid) {
		return validation.output;
	}

	return this.getOutputString("text", config.configMap);
}

module.exports = sayToChat;
