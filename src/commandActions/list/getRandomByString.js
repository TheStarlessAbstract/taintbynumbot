const { aggregate } = require("../../queries/list");

const getRandomByString = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

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

	if (listItems.length === 0)
		return this.getOutputString("stringNotFound", config.configMap);

	config.configMap.set("index", listItems[0].index);
	config.configMap.set("text", listItems[0].text);

	return this.getOutputString("found", config.configMap);
};

module.exports = getRandomByString;
