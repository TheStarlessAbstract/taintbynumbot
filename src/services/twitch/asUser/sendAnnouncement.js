const twitchRepo = require("../../../repos/twitch.js");

const sendAnnouncement = async (broadcaster, moderator, announcement) => {
	const apiClient = twitchRepo.getApiClient();

	try {
		await apiClient.asUser(moderator, async (ctx) => {
			await ctx.chat.sendAnnouncement(broadcaster, announcement);
		});
	} catch (err) {
		console.error(err);
	}
};

module.exports = sendAnnouncement;
