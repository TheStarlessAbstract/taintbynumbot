const { deleteOne } = require("../../../queries/list");

const deleteItem = async function (config) {
	if (config.versionKey !== "deleteItem") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

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
	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	return output;
};

module.exports = deleteItem;
