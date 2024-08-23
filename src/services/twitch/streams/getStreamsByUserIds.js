const twitchRepo = require("../../../repos/twitch.js");

const getStreamsByUserIds = async (users) => {
	const apiClient = twitchRepo.getApiClient();
	let stream;

	try {
		stream = await apiClient.streams.getStreamsByUserIds(users);
	} catch (err) {
		console.error(err);
		stream = "";
	}

	return stream;
};

module.exports = getStreamsByUserIds;
