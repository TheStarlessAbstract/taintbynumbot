const { aggregate } = require("../../../queries/list");
const { firstLetterToUpperCase } = require("../../../utils/modify");

const getRandomByString = async function (config) {
	if (config.versionKey !== "getRandomByString") return;
	let output;

	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	const pipeline = [
		{
			$match: {
				channelId: config.channelId,
				name: config.chatName,
				index: { $exists: true },
				text: { $regex: config.argument, $options: "i" },
			},
		},
		{ $sample: { size: 1 } },
	];
	const listItems = await aggregate(pipeline);

	if (listItems.length === 0) {
		return this.getProcessedOutputString(
			this.getOutput("stringNotFound"),
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

module.exports = getRandomByString;
