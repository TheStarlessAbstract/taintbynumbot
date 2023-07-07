const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const pubSubClient = require("../bot-pubsubclient");

let twitchId = process.env.TWITCH_USER_ID;

const helper = new Helper();

let cooldown = 10000;
let currentTime = new Date();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			currentTime = new Date();

			if (
				helper.isCooldownPassed(
					currentTime,
					title.getTimer(),
					title.getCooldown()
				)
			) {
				title.setTimer(currentTime);
				let apiClient;
				let channel;

				if (
					helper.isVersionActive(versions, 0) &&
					!helper.isValuePresentAndString(config.argument)
				) {
					apiClient = await pubSubClient.getApiClient();
					channel = await apiClient.channels.getChannelInfoById(twitchId);

					if (channel == null) {
						result.push(
							"Twitch says no, and Starless should really sort this out some time after stream"
						);
					}

					result.push("The curent title is: " + channel.title);
				} else if (
					helper.isVersionActive(versions, 1) &&
					helper.isValuePresentAndString(config.argument) &&
					helper.isValidModeratorOrStreamer(config.userInfo)
				) {
					apiClient = await pubSubClient.getApiClient();

					try {
						await apiClient.channels.updateChannelInfo(twitchId, {
							title: config.argument,
						});
					} catch (e) {
						if (e.body.includes("banned words")) {
							result.push(
								"Twitch says you have used a no-no word - Title not updated"
							);
						} else {
							result.push(
								"Twitch has not updated the title for reasons - Try again later"
							);
						}
						return result;
					}

					result.push("Title has been set to " + config.argument);
				}
			}
			return result;
		},
	};
};

let versions = [
	{
		description: "Gets current title",
		usage: "!title",
		usableBy: "users",
		active: true,
	},
	{
		description: "Sets the audio timeout to the specified amount of seconds",
		usage: "!title My mistakes bring all the bots to the yard",
		usableBy: "mods",
		active: true,
	},
];

const title = new TimerCommand(commandResponse, versions, cooldown);

exports.command = title;
