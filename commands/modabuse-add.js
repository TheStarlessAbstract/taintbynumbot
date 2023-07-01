const BaseCommand = require("../classes/base-command");
const Helper = require("../classes/helper");

const chatClient = require("../bot-chatclient");

const Title = require("../models/title");

const helper = new Helper();
let twitchId = process.env.TWITCH_USER_ID;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (helper.isValidModeratorOrStreamer(config.userInfo)) {
				let title;

				if (
					helper.isVersionActive(versions, 0) &&
					!helper.isValuePresentAndString(config.argument)
				) {
					let apiClient = await chatClient.getApiClient();
					let channel = await apiClient.channels.getChannelInfoById(twitchId);

					if (channel == null) {
						result.push(
							"Twitch says no, and Starless should really sort this out some time after stream"
						);
					} else {
						title = channel.title;
					}
				} else if (
					helper.isVersionActive(versions, 1) &&
					helper.isValuePresentAndString(config.argument)
				) {
					title = config.argument;
				}

				if (result.length == 0) {
					let existingTitle = await Title.findOne({ text: title });

					if (existingTitle != null) {
						result.push("This Title has already been added");
					} else {
						let entry = await Title.findOne()
							.sort({ index: -1 })
							.select("index")
							.exec();

						let index;
						if (entry) {
							index = entry.index + 1;
						} else {
							index = 1;
						}

						await Title.create({
							index: index,
							text: title,
							addedBy: config.userInfo.displayName,
						});

						result.push("Title added");
					}
				}
			} else {
				result.push("!addModAbuse is for Mods only");
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

exports.command = addModAbuse;
