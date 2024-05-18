const { findOne } = require("../../../queries/list");

const getByIndex = async function (config) {
	if (config.versionKey !== "getByIndex") return;
	let output;

	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	const item = await findOne({
		channelId: config.channelId,
		name: config.chatName,
		index: config.argument,
	});
	config.configMap.set("index", config.argument);

	if (!item) {
		return this.getProcessedOutputString(
			this.getOutput("idNotFound"),
			config.configMap
		);
	}

	config.configMap.set("text", item.text);

	output = this.getProcessedOutputString(
		this.getOutput("found"),
		config.configMap
	);

	return output;
};

module.exports = getByIndex;
