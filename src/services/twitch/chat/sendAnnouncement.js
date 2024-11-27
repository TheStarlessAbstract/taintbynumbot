const twitchRepo = require("../../../repos/twitch.js");

const sendAnnouncement = async (broadcaster, announcement) => {
	const apiClient = twitchRepo.getApiClient();
	let chatters;

	try {
		await apiClient.chat.sendAnnouncement(broadcaster, announcement);
	} catch (err) {
		console.error(err);
	}
};

module.exports = sendAnnouncement;
