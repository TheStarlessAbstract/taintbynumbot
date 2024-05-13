const { findOne } = require("../../../queries/list");

const getByIndex = async function (config) {
	if (config.versionKey !== "getByIndex") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	const item = await findOne({
		channelId: config.channelId,
		name: config.chatName,
		index: config.argument,
	});
	config.configMap.set("index", config.argument);
	if (!item) {
		output = this.getProcessedOutputString(
			this.getOutput("idNotFound"),
			config.configMap
		);

		return output;
	}

	config.configMap.set("text", item.text);

	output = this.getProcessedOutputString(
		this.getOutput("found"),
		config.configMap
	);

	return output;
};

module.exports = getByIndex;
