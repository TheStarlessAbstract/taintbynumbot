async function sayToChat(config) {
	const configValidation = this.validateConfig(config);
	if (!configValidation) return;
	if (!configValidation.valid) return configValidation.output;

	return this.getOutputString("text", config.configMap);
}

module.exports = sayToChat;
