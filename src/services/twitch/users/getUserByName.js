const twitchRepo = require("../../../../repos/twitch.js");

const getUserByName = async (username) => {
	const apiClient = twitchRepo.getApiClient();
	let user;

	try {
		user = await apiClient.users.getUserByName(username);
	} catch (err) {
		console.error(err);
		user = "";
	}

	return user;
};

module.exports = getUserByName;
