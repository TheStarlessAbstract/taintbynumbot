const { findOne } = require("../../../queries/list");
const {
	isValueNumber,
	isNonEmptyString,
} = require("../../../utils/valueChecks");

const editItem = async function (config) {
	if (config.versionKey !== "editItem") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	const { a: index, b: textUpdate } = this.getArgumentParams(config.argument);
	let outputType;

	if (!isValueNumber(index)) {
		outputType = "invalidIndex";
	}
	if (!isNonEmptyString(textUpdate)) {
		outputType = "invalidText";
	}
	if (outputType) {
		output = this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);

		return output;
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
		output = this.getProcessedOutputString(
			this.getOutput(outputType),
			config.configMap
		);

		return output;
	}

	item.text = textUpdate;
	await item.save();

	output = this.getProcessedOutputString(
		this.getOutput("updated"),
		config.configMap
	);

	return output;
};

module.exports = editItem;
