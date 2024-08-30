const twitchRepo = require("../../../repos/twitch");

const getSubscriptionsForUsers = async (broadcaster, users) => {
	const apiClient = twitchRepo.getApiClient();
	let subs;

	try {
		subs = await apiClient.subscriptions.getSubscriptionsForUsers(
			broadcaster,
			users
		);
	} catch (err) {
		console.error(err);
		subs = "";
	}

	return subs;
};

module.exports = getSubscriptionsForUsers;
