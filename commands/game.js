const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const pubSubClient = require("../bot-pubsubclient");

const helper = new Helper();

let cooldown = 10000;
let currentTime = new Date();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let twitchId = config.channelId;
			currentTime = new Date();

			if (
				helper.isCooldownPassed(
					currentTime,
					game.getTimer(),
					game.getCooldown()
				)
			) {
				game.setTimer(currentTime);
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
						return result;
					}

					result.push(
						"@" +
							config.userInfo.displayName +
							" -> " +
							channel.displayName +
							" is playing " +
							channel.gameName
					);
				} else if (
					helper.isValuePresentAndString(config.argument) &&
					config.argument.length > 3 &&
					helper.isVersionActive(versions, 1) &&
					helper.isValidModeratorOrStreamer(config.userInfo)
				) {
					apiClient = await pubSubClient.getApiClient();

					let gamesPaginated = await apiClient.search.searchCategoriesPaginated(
						config.argument
					);

					let currentPageGames = await gamesPaginated.getNext();
					let pages = 0;

					let gameId;
					while (currentPageGames.length > 0 && pages < 3) {
						for (let i = 0; i < currentPageGames.length; i++) {
							if (currentPageGames[i].name.startsWith(config.argument)) {
								gameId = currentPageGames[i].id;
								break;
							}
						}

						currentPageGames = await gamesPaginated.getNext();
						pages++;
					}

					if (gameId == undefined) {
						result.push(
							"@" + config.userInfo.displayName + " no game found by that name."
						);
						return result;
					}

					try {
						await apiClient.channels.updateChannelInfo(twitchId, {
							gameId: gameId,
						});
					} catch (e) {
						result.push(
							"Twitch has not updated the game for reasons - Try again later"
						);
						return result;
					}

					channel = await apiClient.channels.getChannelInfoById(twitchId);

					result.push(
						"@" +
							config.userInfo.displayName +
							" -> The stream game has been updated to: " +
							channel.gameName
					);
				}
			}
			return result;
		},
	};
};

let versions = [
	{
		description: "Gets current game category for the stream",
		usage: "!game",
		usableBy: "users",
		active: true,
	},
	{
		description: "Sets the currenty game category for the stream",
		usage: "!game Cyberpunk 2077",
		usableBy: "mods",
		active: true,
	},
];

const game = new TimerCommand(commandResponse, versions, cooldown);

exports.command = game;
