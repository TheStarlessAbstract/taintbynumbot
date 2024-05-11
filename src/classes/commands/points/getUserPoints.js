const { findOne } = require("../../../queries/loyaltyPoints");

const getUserPoints = async function (config) {
	if (config.versionKey !== "getUserPoints") return;
	let output;

	const user = await findOne(
		{
			channelId: config.channelId,
			viewerId: config.userId,
		},
		{ points: 1 }
	);

	let outputType = "userNotFound";
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

module.exports = getUserPoints;
