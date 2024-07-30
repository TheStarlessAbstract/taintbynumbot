const twitchRepo = require("../../../repos/twitch.js");

const getClipsForBroadcaster = async (broadcaster, filter) => {
	const apiClient = twitchRepo.getApiClient();
	let success = true;

	try {
		await apiClient.clips.getClipsForBroadcaster(broadcaster, filter);
	} catch (err) {
		console.error(err);
		success = false;
	}

	return success;
};

module.exports = getClipsForBroadcaster;
