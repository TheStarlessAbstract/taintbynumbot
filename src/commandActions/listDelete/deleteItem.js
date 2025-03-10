const { deleteOne } = require("../../queries/list");

const deleteItem = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	config.configMap.set("index", config.argument);

	const item = await deleteOne({
		channelId: config.channelId,
		name: this.commandGroup,
		index: config.argument,
	});

	if (item.deletedCount === 0)
		return this.getOutputString("notDeleted", config.configMap);

	return this.getOutputString("deleted", config.configMap);
};

module.exports = deleteItem;
