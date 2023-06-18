const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const DeathCounter = require("../models/deathcounter");

const chatClient = require("../bot-chatclient");

const helper = new Helper();

let twitchId = process.env.TWITCH_USER_ID;

let cooldown = 10000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (
				helper.isCooldownPassed(
					currentTime,
					deaths.getTimer(),
					deaths.getCooldown()
				) ||
				helper.isStreamer(config.userInfo)
			) {
				deaths.setTimer(currentTime);
				let apiClient = await chatClient.getApiClient();
				let channel = await apiClient.channels.getChannelInfoById(twitchId);

				if (channel != null) {
					let deathCounters = await DeathCounter.find({
						gameTitle: channel.gameName,
					});

					let gameDeaths = deathCounters.reduce(
						(total, counter) => total + counter.deaths,
						0
					);

					result.push(
						"Starless has died a grand total of " +
							gameDeaths +
							" times, while ✨playing✨ " +
							channel.gameName
					);
				} else {
					result.push(
						"Twitch isn't being very helpful right now, try again later"
					);
				}
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Gets total deaths for current game",
		usage: "!deaths",
		usableBy: "users",
		active: true,
	},
];

const deaths = new TimerCommand(commandResponse, versions, cooldown);

exports.command = deaths;
