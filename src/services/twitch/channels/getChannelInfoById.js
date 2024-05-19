const twitchRepo = require("../../../repos/twitch.js");

const getChannelInfoById = async (id) => {
	const apiClient = twitchRepo.getApiClient();
	let channel;

	try {
		channel = await apiClient.channels.getChannelInfoById(id);
	} catch (err) {
		console.error(err);
		channel = "";
	}

	return channel;
};

module.exports = getChannelInfoById;
