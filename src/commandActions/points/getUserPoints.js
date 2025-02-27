const { findOne } = require("../../queries/loyaltyPoints");

const getUserPoints = async function (config) {
	const user = await findOne(
		{
			channelId: config.channelId,
			viewerId: config.userId,
		},
		{ points: 1 }
	);

	if (!user) this.getOutputString("userNotFound", config.configMap);
	config.configMap.set("points", user.points);
	return this.getOutputString("userPoints", config.configMap);
};

module.exports = getUserPoints;
