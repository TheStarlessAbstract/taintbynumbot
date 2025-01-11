const twitchRepo = require("../../../repos/twitch");

const sendAnnouncement = async (broadcaster, moderator, announcement) => {
	const apiClient = twitchRepo.getApiClient();

	if (!announcement?.message) {
		console.error(
			"sendAnnoucement asUser - no message included in anncounement"
		);
		return;
	}

	try {
		await apiClient.asUser(moderator, async (ctx) => {
			await ctx.chat.sendAnnouncement(broadcaster, announcement);
		});
	} catch (err) {
		console.error(err);
	}
};

module.exports = sendAnnouncement;
