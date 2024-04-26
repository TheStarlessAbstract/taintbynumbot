const twitchRepo = require("../../../../repos/twitch.js");

const getStreamByUserId = async (user) => {
	const apiClient = twitchRepo.getApiClient();
	let stream;

	try {
		stream = await apiClient.streams.getStreamByUserId(user);
	} catch (err) {
		console.error(err);
		stream = "";
	}

	return stream;
};

module.exports = getStreamByUserId;
