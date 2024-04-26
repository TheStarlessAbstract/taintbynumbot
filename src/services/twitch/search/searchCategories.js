const twitchRepo = require("../../../../repos/twitch.js");

const searchCategories = async (query, pagination) => {
	const apiClient = twitchRepo.getApiClient();
	let search;

	try {
		search = await apiClient.search.searchCategories(query, pagination);
	} catch (err) {
		console.error(err);
		search = "";
	}

	return search;
};

module.exports = searchCategories;
