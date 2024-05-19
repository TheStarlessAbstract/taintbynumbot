const twitchRepo = require("../../../repos/twitch.js");

const getChannelFollowers = async (broadcaster, user, pagination) => {
	const apiClient = twitchRepo.getApiClient();
	let followers;

	try {
		followers = await apiClient.channels.getChannelFollowers(
			broadcaster,
			user,
			pagination
		);
	} catch (err) {
		console.error(err);
		chatters = "";
	}

	return followers;
};

module.exports = getChannelFollowers;
