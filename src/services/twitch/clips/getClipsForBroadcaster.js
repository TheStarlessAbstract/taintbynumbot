const twitchRepo = require("../../../repos/twitch.js");

const getClipsForBroadcaster = async (broadcaster, filter) => {
	const apiClient = twitchRepo.getApiClient();
	let firstPass = true;
	let clipList = [];
	let clips;

	try {
		while (firstPass) {
			clips = await apiClient.clips.getClipsForBroadcaster(broadcaster, filter);
			console.log(clips.data.length);

			if (clips.data.length === 0) {
				return { list: clipList, cursor: clips.cursor };
			}

			filter.after = clips.cursor;
			clipList = clipList.concat(clips.data);
		}
	} catch (err) {
		console.error(err);
		return;
	}
};

module.exports = getClipsForBroadcaster;
