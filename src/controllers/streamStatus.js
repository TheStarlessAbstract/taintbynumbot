const channelsService = require("../services/channels/channels");
const { getStreamsByUserIds } = require("../services/twitch/streams");
const { start, stop } = require("./loyalty");

function init() {
	setInterval(async () => {
		const channels = channelsService.getAllChannel();
		if (channels.length === 0) {
			// stop interval, start again in 30-60 minutes
		}
		const streams = await getStreamsByUserIds([...channels.keys()]);

		channels.forEach((value, key) => {
			streams.some((stream) => {
				if (stream.userId !== value.id) value.isLive = false;
				else value.isLive = true;
			});

			const nowLive = value.isLive && !value.lastIsLiveUpdate;
			const nowNotLive = !value.isLive && value.lastIsLiveUpdate;

			if (nowLive) start(value.id);
			else if (nowNotLive) stop(value.id);
			if (nowLive || nowNotLive)
				value.lastIsLiveUpdate = !value.lastIsLiveUpdate;
		});
	}, 5 * 60 * 1000);
}

exports.init = init;
