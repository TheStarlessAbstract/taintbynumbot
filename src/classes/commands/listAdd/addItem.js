const { findOne, create } = require("../../../queries/list");
const List = require("../../../models/list.js");

const addItem = async function (config) {
	if (config.versionKey !== "addItem") return;
	let output;

	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	const item = await findOne({
		channelId: config.channelId,
		name: this.listTypeName,
		text: config.argument,
	});

	if (item) {
		returnthis.getProcessedOutputString(
			this.getOutput("alreadyExists"),
			config.configMap
		);
	}

	const options = {
		sort: { index: -1 },
	};

	const projection = {
		index: 1,
	};
	const lastEntry = await findOne(
		{
			channelId: config.channelId,
			name: this.listTypeName,
		},
		projection,
		options
	);
	const index = lastEntry ? lastEntry.index + 1 : 1;

	await create({
		index: index,
		channelId: config.channelId,
		name: this.listTypeName,
		text: config.argument,
		createdBy: config.userId,
		createdOn: new Date(),
	});

	config.configMap.set("text", config.argument);

	return this.getProcessedOutputString(
		this.getOutput("added"),
		config.configMap
	);
};

module.exports = addItem;
