const { findOne } = require("../../../queries/loyaltyPoints");

const getUserPoints = async function (config) {
	if (config.versionKey !== "getUserPoints") return;

	let output;
	let outputType = "userPoints";
	const user = await findOne(
		{
			channelId: config.channelId,
			viewerId: config.userId,
		},
		{ points: 1 }
	);
	if (!user) outputType = "userNotFound";
	if (user) config.configMap.set("points", user.points);

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);
	if (!output) outputType == "error";

	return output;
};

module.exports = getUserPoints;
