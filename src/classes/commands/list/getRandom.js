const { aggregate } = require("../../../queries/list");
const { firstLetterToUpperCase } = require("../../../utils/modify");

const getRandom = async function (config) {
	if (config.versionKey !== "getRandom") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	const pipeline = [
		{
			$match: {
				channelId: config.channelId,
				name: config.chatName,
				index: { $exists: true },
				text: { $ne: "" },
			},
		},
		{ $sample: { size: 1 } },
	];
	const listItems = await aggregate(pipeline);

	if (listItems.length === 0) {
		return this.getProcessedOutputString(
			this.getOutput("randomNotFound"),
			config.configMap
		);
	}

	config.configMap.set("index", listItems[0].index);
	config.configMap.set("text", listItems[0].text);

	output = this.getProcessedOutputString(
		this.getOutput("found"),
		config.configMap
	);

	return output;
};

module.exports = getRandom;
