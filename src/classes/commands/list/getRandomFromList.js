const { aggregate } = require("../../../queries/list");

const getRandomFromList = async function (config) {
	console.log(1);
	if (config.versionKey !== "getRandomFromList") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	const pipeline = [{ $sample: { size: 1 } }];

	const listItem = await aggregate(pipeline);
	console.log(listItem);

	// output = this.getProcessedOutputString(
	// 	this.getOutput("streamIsLive"),
	// 	config.configMap
	// );

	// return output;
};

module.exports = getRandomFromList;
