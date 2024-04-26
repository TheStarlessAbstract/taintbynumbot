const twitchRepo = require("../../../../repos/twitch.js");

const updateChannelInfo = async (user, data) => {
	const apiClient = twitchRepo.getApiClient();
	let channel;

	try {
		channel = await apiClient.channels.updateChannelInfo(user, data);
	} catch (err) {
		console.error(err);
		channel = "";
	}

	return true;
};

module.exports = updateChannelInfo;
