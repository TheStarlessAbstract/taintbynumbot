const { findOne } = require("../../../queries/loyaltyPoints");
const { splitArgs } = require("../../../utils/modify");

const editMessage = async function (config) {
	if (config.versionKey !== "editMessage") return;
	let output;
	let outputType = "";
	if (!config?.permitted) outputType = "notPermitted";
	if (!outputType && !config.argument) outputType = "noArgument";
	const { first: index, second: textUpdate } = splitArgs(config.argument, 0);

	// get the message with this index
	// if any message has this text

	if (user) {
		config.configMap.set("points", user.points);
		outputType = "userPoints";
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	return output;
};

module.exports = editMessage;
