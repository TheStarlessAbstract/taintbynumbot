const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const twitch = require("../services/twitch");

const helper = new Helper();

let cooldown = 5000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let response;
			let currentTime = new Date();
			let channel;

			if (
				helper.isValidModeratorOrStreamer(config.userInfo) &&
				helper.isCooldownPassed(currentTime, so.timer, cooldown)
			) {
				if (helper.isValuePresentAndString(config.argument)) {
					so.setTimer(currentTime);

					let username = config.argument;
					if (username.startsWith("@")) {
						username = username.slice(1);
					}

					let user = await twitch.getUserByName(username);

					if (!user) {
						result.push(`Couldn't find a user by the name of ${username}`);
					} else {
						channel = await twitch.getChannelInfoById(user.id);

						if (channel.gameName != "") {
							result.push(
								`@${user.displayName} last streamed ${channel.gameName}. I hear they love the Taint!`
							);
						}

						response = await twitch.shoutoutUser(config.channelId, user.id);
					}
				} else if (!helper.isValuePresentAndString(config.argument)) {
					result.push(
						`You have to include a username to shoutout someone: !so @buhhsbot`
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				result.push(`!so is for Mods only`);
			}

			return result;
		},
	};
};

let versions = [
	{
		description: `Gives a shoutout to some wonderful user`,
		usage: `!so @buhhsbot`,
		usableBy: `mods`,
		active: true,
	},
];

const so = new TimerCommand(commandResponse, versions, cooldown);

exports.command = so;
