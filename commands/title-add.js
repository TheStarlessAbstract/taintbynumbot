require("dotenv").config();

const chatClient = require("../bot-chatclient");

const Title = require("../models/title");

let twitchId = process.env.TWITCH_USER_ID;

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp) {
				let entries = await Title.find({});
				let index = entries.length ? getNextIndex(entries) : 1;
				let message;
				let user;

				if (!config.argument) {
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
				} else if (config.argument) {
					if (config.argument.includes("@")) {
						config.argument = config.argument.split("@");
						message = config.argument[0];
						user = config.argument[1];
					} else {
						message = config.argument;
					}
				}

				if (result.length == 0) {
					try {
						let created = await Title.create({
							index: index,
							text: message,
							user: user,
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
				result.push("!addTitle command is for Mods only");
			}

			return result;
		},
		versions: [
			{
				description:
					"Saves a new, totally super funny, and not at all abusive title to Starless, likely created by Rose",
				usage:
					"!addtitle Streamer barely plays game, probably in the menu right now",
				usableBy: "mods",
			},
		],
	};
};

function getNextIndex(array) {
	return array[array.length - 1].index + 1;
}

exports.getCommand = getCommand;
