async function sayToChat(config) {
	if (!config.configMap) {
		console.error("no configMap for sayToChat");
		return;
	}

	if (!this.isPermitted(config.permitted))
		return this.getOutputString("notPermitted", config.configMap);

	return this.getOutputString("text", config.configMap);
}

module.exports = sayToChat;
