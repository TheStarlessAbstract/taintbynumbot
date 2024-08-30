const twitchRepo = require("../../../repos/twitch");

const getChannelFollowersPaginated = async (broadcaster) => {
	const apiClient = twitchRepo.getApiClient();
	let follows;

	try {
		follows = await apiClient.channels.getChannelFollowersPaginated(
			broadcaster
		);
	} catch (err) {
		console.error(err);
		return undefined;
	}

	let followsPage = await follows.getNext();
	if (followsPage.length == 0) return undefined;
	const followers = [];

	while (followsPage.length > 0) {
		followers = followers.concat(followsPage);
		followsPage = await follows.getNext();
	}

	return followers;
};

module.exports = getChannelFollowersPaginated;
