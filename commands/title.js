const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const chatClient = require("../bot-chatclient");

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

				if (
					helper.isVersionActive(versions, 0) &&
					!helper.isValuePresentAndString(config.argument)
				) {
					apiClient = await chatClient.getApiClient();
					let channel = await apiClient.channels.getChannelInfoById(twitchId);

					if (channel == null) {
						result.push(
							"Twitch says no, and Starless should really sort this out some time after stream"
						);
					}

					result.push("The curent title is: " + channel.title);
				} else if (
					helper.isVersionActive(versions, 1) &&
					helper.isValuePresentAndString(config.argument)
				) {
					if (isValidModeratorOrStreamer(config.userInfo)) {
						apiClient = chatClient.getApiClient();

						await apiClient.channels.updateChannelInfo(twitchId, {
							title: config.argument,
						});

						result.push("Title has been set to " + config.argument);
					} else if (!isValidModeratorOrStreamer(config.userInfo)) {
						result.push("Only mods can change the title");
					}
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
title.setTimer(currentTime);

exports.command = title;
