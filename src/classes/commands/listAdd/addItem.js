const { findOne, create } = require("../../../queries/list");
const List = require("../../../models/list.js");

const addItem = async function (config) {
	if (config.versionKey !== "addItem") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	const item = await findOne({
		channelId: config.channelId,
		name: this.listTypeName,
		text: config.argument,
	});

	if (item) {
		output = this.getProcessedOutputString(
			this.getOutput("alreadyExists"),
			config.configMap
		);

		return output;
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

	output = this.getProcessedOutputString(
		this.getOutput("added"),
		config.configMap
	);

	return output;
};

module.exports = addItem;
