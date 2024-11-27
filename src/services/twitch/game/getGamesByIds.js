const twitchRepo = require("../../../repos/twitch.js");

const getGamesByIds = async (ids) => {
	const apiClient = twitchRepo.getApiClient();

	try {
		return await apiClient.games.getGamesByIds(ids);
	} catch (err) {
		console.error(err);
		return;
	}
};

module.exports = getGamesByIds;
