const {
	getChannelFollowers,
} = require("../../../services/twitch/channels/index.js");

const getFollowLength = async function (config) {
	if (config.versionKey !== "getFollowLength") return;

	const channelFollowers = await getChannelFollowers(
		config.channelId,
		config.userId
	);
	if (!channelFollowers) outputType = "error";

	let outputType;

	if (!channelFollowers?.data[0]) {
		outputType = "notFollowing";
	} else {
		outputType = "following";
		const follower = channelFollowers.data[0];
		const currentTimestamp = Date.now();
		const followStartTimestamp = follower.followDate.getTime();
		const followLength = this.getFollowLength(
			currentTimestamp - followStartTimestamp
		);

		config.configMap.set("followLength", followLength);
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	return output;
};

module.exports = getFollowLength;
