async function sayToChat(config) {
	if (config.versionKey !== "sayToChat") return;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	const output = this.getProcessedOutputString(
		this.getOutput("text"),
		config.configMap
	);

	return output;
}

module.exports = sayToChat;
