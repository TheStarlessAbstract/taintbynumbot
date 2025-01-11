const { findOne } = require("../../../queries/list");

const getByIndex = async function (config) {
	// check if permitted
	if (!config?.permitted || typeof config.permitted !== "boolean") {
		return this.getOutputString("notPermitted", config.configMap);
	}

	const item = await findOne({
		channelId: config.channelId,
		name: config.chatName,
		index: config.argument,
	});

	config.configMap.set("index", config.argument);

	if (!item) {
		return this.getProcessedOutputString("idNotFound", config.configMap);
	}

	config.configMap.set("text", item.text);

	return this.getProcessedOutputString("found", config.configMap);
};

module.exports = getByIndex;
