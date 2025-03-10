const { findOne, create } = require("../../queries/list");

const addItem = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	const item = await findOne({
		channelId: config.channelId,
		name: this.commandGroup,
		text: config.argument,
	});

	if (item) return this.getOutputString("alreadyExists", config.configMap);

	const options = {
		sort: { index: -1 },
	};

	const projection = {
		index: 1,
	};
	const lastEntry = await findOne(
		{
			channelId: config.channelId,
			name: this.commandGroup,
		},
		projection,
		options
	);
	const index = lastEntry ? lastEntry.index + 1 : 1;

	await create({
		index: index,
		channelId: config.channelId,
		name: this.commandGroup,
		text: config.argument,
		createdBy: config.userId,
		createdOn: new Date(),
	});

	config.configMap.set("text", config.argument);

	return this.getOutputString("added", config.configMap);
};

module.exports = addItem;
