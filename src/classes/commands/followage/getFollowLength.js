const {
	getChannelFollowers,
} = require("../../../services/twitch/channels/index.js");

const getFollowLength = async function (config) {
	if (config.versionKey !== "getFollowLength") return;
	let output;

	const channelFollowers = await getChannelFollowers(
		config.channelId,
		config.userId
	);

	if (!channelFollowers?.data[0]) {
		output = this.getProcessedOutputString(
			this.getOutput("notFollowing"),
			config.configMap
		);

		return output;
	}

	const follower = channelFollowers.data[0];
	const currentTimestamp = Date.now();
	const followStartTimestamp = follower.followDate.getTime();
	const followLength = this.getFollowLength(
		currentTimestamp - followStartTimestamp
	);

	config.configMap.set("followLength", followLength);

	output = this.getProcessedOutputString(
		this.getOutput("following"),
		config.configMap
	);

	return output;
};

module.exports = getFollowLength;
