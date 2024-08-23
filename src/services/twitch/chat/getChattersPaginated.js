const twitchRepo = require("../../../repos/twitch.js");

const getChattersPaginated = async (broadcaster) => {
	const apiClient = twitchRepo.getApiClient();
	let chatters;

	try {
		chatters = await apiClient.chat.getChattersPaginated(broadcaster);
	} catch (err) {
		console.error(err);
		chatters = null;
	}

	return chatters;
};

module.exports = getChattersPaginated;
