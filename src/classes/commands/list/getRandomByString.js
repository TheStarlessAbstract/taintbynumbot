const { aggregate } = require("../../../queries/list");

const getRandomByString = async function (config) {
	// check if permitted
	if (!config?.permitted || typeof config.permitted !== "boolean") {
		return this.getOutputString("notPermitted", config.configMap);
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
		return this.getProcessedOutputString("stringNotFound", config.configMap);
	}

	config.configMap.set("index", listItems[0].index);
	config.configMap.set("text", listItems[0].text);

	return this.getProcessedOutputString("found", config.configMap);
};

module.exports = getRandomByString;
