const { findOne } = require("../../queries/list");

const getByIndex = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	const item = await findOne({
		channelId: config.channelId,
		name: config.chatName,
		index: config.argument,
	});

	config.configMap.set("index", config.argument);

	if (!item) return this.getOutputString("idNotFound", config.configMap);
	config.configMap.set("text", item.text);

	return this.getOutputString("found", config.configMap);
};

module.exports = getByIndex;
