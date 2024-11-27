const twitchRepo = require("../../../repos/twitch");

const getClipsForBroadcasterPaginated = async (broadcaster, filter) => {
	const apiClient = twitchRepo.getApiClient();
	let clips;

	try {
		clips = await apiClient.clips.getClipsForBroadcasterPaginated(
			broadcaster,
			filter
		);
	} catch (err) {
		console.error(err);
		return undefined;
	}

	let clipsPage = await clips.getNext();
	if (clipsPage.length == 0) return undefined;
	let clipList = [];

	while (clipsPage.length > 0) {
		clipList = clipList.concat(clipsPage);
		clipsPage = await clips.getNext();
	}

	return clipList;
};

module.exports = getClipsForBroadcasterPaginated;
