const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const spotify = require("../services/spotifyServices");

const helper = new Helper();

let cooldown = 30000;
let currentTime = new Date();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			currentTime = new Date();

			if (
				helper.isStreamer ||
				helper.isCooldownPassed(
					currentTime,
					song.getTimer(),
					song.getCooldown()
				)
			) {
				song.setTimer(currentTime);

				let channelId = config.channelId;
				let songString = await spotify.getCurrentPlaying(channelId);

				result.push(songString);
			}
			return result;
		},
	};
};

let versions = [
	{
		description: "Gets current playing song",
		usage: "!song",
		usableBy: "users",
		active: true,
	},
];

const song = new TimerCommand(commandResponse, versions, cooldown);

exports.command = song;
