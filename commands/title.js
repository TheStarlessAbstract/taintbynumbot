const BaseCommand = require("../classes/base-command");

const chatClient = require("../bot-chatclient");

let twitchId = process.env.TWITCH_USER_ID;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			if (config.isModUp) {
				if (versions[0].active && !config.argument) {
					result.push(["The curent title is: "]);
				} else if (versions[1].active && config.argument) {
					const apiClient = chatClient.getApiClient();

					console.log(config.argument);
					await apiClient.channels.updateChannelInfo(twitchId, {
						title: config.argument,
					});

					result.push("Title has been set to " + config.argument);
				}
			} else if (!config.isModUp) {
				result.push("!title command is for Mods only");
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

const title = new BaseCommand(commandResponse, versions);

exports.command = title;
