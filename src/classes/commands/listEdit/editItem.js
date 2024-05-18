const { findOne } = require("../../../queries/list");
const {
	isValueNumber,
	isNonEmptyString,
} = require("../../../utils/valueChecks");

const editItem = async function (config) {
	if (config.versionKey !== "editItem") return;
	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	const { a: index, b: textUpdate } = this.getArgumentParams(config.argument);
	config.configMap.set(index, index);
	config.configMap.set(textUpdate, textUpdate);
	let outputType;

	if (!isValueNumber(index)) {
		outputType = "invalidIndex";
	}
	if (!isNonEmptyString(textUpdate)) {
		outputType = "invalidText";
	}
	if (outputType) {
		return this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);
	}

	const item = await findOne({
		channelId: config.channelId,
		name: this.listTypeName,
		index: index,
	});

	if (!item) {
		outputType = "notFound";
	}
	if (item.text === textUpdate) {
		outputType = "currentText";
	}

	if (outputType) {
		return this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);
	}

	item.text = textUpdate;
	await item.save();

	return this.getProcessedOutputString(
		this.getOutput("updated"),
		config.configMap
	);
};

module.exports = editItem;
