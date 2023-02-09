const BaseCommand = require("../classes/base-command");

const chatClient = require("../bot-chatclient");

const Title = require("../models/title");

let twitchId = process.env.TWITCH_USER_ID;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp) {
				let entries = await Title.find({});
				let index = entries.length ? getNextIndex(entries) : 1;
				let message;

				if (versions[0].active && !config.argument) {
					try {
						const apiClient = chatClient.getApiClient();
						let channel = await apiClient.channels.getChannelInfo(twitchId);

						if (channel == null) {
							result.push(
								"Twitch says no, and Starless should really sort this out some time after stream"
							);
						} else {
							message = channel.title;
						}
					} catch (err) {
						result.push(
							"Twitch says no, and Starless should really sort this out some time after stream"
						);
					}
				} else if (versions[1].active && config.argument) {
					if (config.argument.includes("@")) {
						config.argument = config.argument.split("@");
						message = config.argument[0];
					} else {
						message = config.argument;
					}
				}

				if (result.length == 0) {
					try {
						let created = await Title.create({
							index: index,
							text: message,
							addedBy: config.userInfo.displayName,
						});

						if (created._id) {
							result.push("Title added");
						}
					} catch (err) {
						if (err.code == 11000) {
							result.push("This title has already been added");
						} else {
							console.log(err);
							result.push(
								"There was some problem adding the title, and Starless should really sort this shit out."
							);
						}
					}
				}
			} else if (!config.isModUp) {
				result.push("!addModAbuse command is for Mods only");
			}

			return result;
		},
	};
};

let versions = [
	{
		description:
			"Saves the current title, because it is totally super funny, and not at all abusive title to Starless, likely created by Rose",
		usage: "!addModAbuse",
		usableBy: "mods",
		active: true,
	},
	{
		description:
			"Saves a new, totally super funny, and not at all abusive title to Starless, likely created by Rose",
		usage:
			"!addModAbuse Streamer barely plays game, probably in the menu right now",
		usableBy: "mods",
		active: true,
	},
];

const addModAbuse = new BaseCommand(commandResponse, versions);

function getNextIndex(array) {
	return array[array.length - 1].index + 1;
}

exports.command = addModAbuse;
