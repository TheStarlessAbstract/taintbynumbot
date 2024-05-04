const twitchRepo = require("../../../../repos/twitch.js");

const updateChannelInfo = async (user, data) => {
	const apiClient = twitchRepo.getApiClient();

	try {
		await apiClient.channels.updateChannelInfo(user, data);
	} catch (err) {
		console.error(err);
		return { success: false, err: err };
	}

	return { success: true };
};

module.exports = updateChannelInfo;
