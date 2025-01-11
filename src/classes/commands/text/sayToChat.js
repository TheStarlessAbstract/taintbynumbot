async function sayToChat(config) {
	if (config.versionKey !== "sayToChat") return;

	if (!config?.permitted) {
		output = this.getOutputString("notPermitted", config.configMap);
		return output;
	}

	const output = this.getOutputString("text", config.configMap);

	return output;
}

module.exports = sayToChat;
