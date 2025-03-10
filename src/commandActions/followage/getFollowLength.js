const {
	getChannelFollowers,
} = require("../../services/twitch/channels/index.js");

const getFollowLength = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	const channelFollowers = await getChannelFollowers(
		config.channelId,
		config.userId
	);

	if (!channelFollowers?.data[0])
		return this.getOutputString("notFollowing", config.configMap);

	const follower = channelFollowers.data[0];
	const currentTimestamp = Date.now();
	const followStartTimestamp = follower.followDate.getTime();
	const followLength = this.getFollowLength(
		currentTimestamp - followStartTimestamp
	);

	config.configMap.set("followLength", followLength);
	return this.getOutputString("following", config.configMap);
};

module.exports = getFollowLength;
