const { findOne } = require("../../queries/list");
const { isValueNumber, isNonEmptyString } = require("../../utils/valueChecks");
const { splitArgs } = require("../../utils/modify");

const editItem = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	const { first: index, second: textUpdate } = splitArgs(config.argument, 0);
	config.configMap.set(index, index);
	config.configMap.set(textUpdate, textUpdate);
	let outputType;

	if (!isValueNumber(index))
		return this.getOutputString("invalidIndex", config.configMap);

	if (!isNonEmptyString(textUpdate))
		return this.getOutputString("invalidText", config.configMap);

	const item = await findOne({
		channelId: config.channelId,
		name: this.commandGroup,
		index: index,
	});

	if (!item) this.getOutputString("notFound", config.configMap);
	if (item.text === textUpdate)
		this.getOutputString("currentText", config.configMap);

	item.text = textUpdate;
	await item.save();

	return this.getOutputString("updated", config.configMap);
};

module.exports = editItem;
