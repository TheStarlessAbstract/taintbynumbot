const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const chatClient = require("../bot-chatclient");

const helper = new Helper();

let cooldown = 5000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();
			let stream;
			let streamed;

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

					let apiClient = await chatClient.getApiClient();
					let user = await apiClient.users.getUserByName(username);

					if (!user) {
						result.push("Couldn't find a user by the name of " + username);
					} else {
						stream = await apiClient.channels.getChannelInfoById(user.id);

						if (stream.gameName != "") {
							streamed = ", they last streamed " + stream.gameName;
						} else {
							streamed = "";
						}

						result.push(
							"Go check out " +
								username +
								" at twitch.tv/" +
								username +
								streamed +
								". I hear they love the Taint"
						);
					}
				} else if (!helper.isValuePresentAndString(config.argument)) {
					result.push(
						"You got to include a username to shoutout someone: !so @buhhsbot"
					);
				}
			} else if (!helper.isValidModeratorOrStreamer(config.userInfo)) {
				result.push("!so is for Mods only");
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Gives a shoutout to some wonderful user",
		usage: "!so @buhhsbot",
		usableBy: "mods",
		active: true,
	},
];

const so = new TimerCommand(commandResponse, versions, cooldown);

exports.command = so;
