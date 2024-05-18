const { deleteOne } = require("../../../queries/list");

const deleteItem = async function (config) {
	if (config.versionKey !== "deleteItem") return;
	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	config.configMap.set(index, config.argument);

	const item = await deleteOne({
		channelId: config.channelId,
		name: this.listTypeName,
		index: config.argument,
	});

	let outputType;
	if (item.deletedCount === 0) {
		outputType = "notDeleted";
	} else {
		outputType = "deleted";
	}

	return this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);
};

module.exports = deleteItem;
