const twitchRepo = require("../../../../repos/twitch.js");

const shoutoutUser = async (from, to) => {
	let success = true;

	try {
		await apiClient.chat.shoutoutUser(from, to);
	} catch (err) {
		console.error(err);
		success = false;
	}

	return success;
};

module.exports = shoutoutUser;
