const BaseCommand = require("../classes/base-command");
const { updateChannelInfo } = require("../services/twitch/channels");
const { getStreamByUserId } = require("../services/twitch/streams");
const { searchCategories } = require("../services/twitch/search");
const {
	getProcessedOutputString,
	startsWithCaseInsensitive,
} = require("../utils");

const commandResponse = async (config) => {
	if (
		config.versionKey !== "noArgument" &&
		config.versionKey !== "stringArgument"
	)
		return;

	let output;
	let outputType;
	let game;
	// game = await searchCategories("Baldur's Gate 3");
	// console.log(game.data);

	if (config.versionKey == "noArgument") {
		let stream = await getStreamByUserId(config.channelId);
		outputType = "noStream";
		if (stream) {
			outputType = "streamIsLive";
			config.configMap.set("gameName", stream.gameName);
		}
	}
	if (config.versionKey == "stringArgument") {
		outputType = "gameNotFound";
		game = await searchCategories(config.argument);
		for (let i = 0; i < game.length; i++) {
			if (!startsWithCaseInsensitive(game[i].name, config.argument)) continue;

			config.configMap.set("gameName", data[i].name);
			outputType = "gameFound";
			break;
		}
	}

	output = getProcessedOutputString(
		config.output.get(outputType),
		config.configMap
	);
	if (!output) return;

	// if (outputType === "gameFound") {
	// 	await updateChannelInfo();
	// }

	return output;
};

const command = new BaseCommand(commandResponse);

module.exports = command;

////////////////

// let gamesPaginated = await apiClient.search.searchCategoriesPaginated(
// 	config.argument
// );

// let currentPageGames = await gamesPaginated.getNext();
// let pages = 0;

// let gameId;
// while (currentPageGames.length > 0 && pages < 3) {
// 	for (let i = 0; i < currentPageGames.length; i++) {
// 		if (
// 			helper.startsWithCaseInsensitive(
// 				currentPageGames[i].name,
// 				config.argument
// 			)
// 		) {
// 			gameId = currentPageGames[i].id;
// 			break;
// 		}
// 	}

// 	if (gameId == undefined) {
// 		currentPageGames = await gamesPaginated.getNext();
// 		pages++;
// 	} else {
// 		break;
// 	}
// }

// if (gameId == undefined) {
// 	result.push(
// 		"@" + config.userInfo.displayName + " no game found by that name."
// 	);
// 	return result;
// }

// try {
// 	await apiClient.channels.updateChannelInfo(twitchId, {
// 		gameId: gameId,
// 	});
// } catch (e) {
// 	result.push("Twitch has not updated the game for reasons - Try again later");
// 	return result;
// }

// channel = await apiClient.channels.getChannelInfoById(twitchId);

// result.push(
// 	"@" +
// 		config.userInfo.displayName +
// 		" -> The stream game has been updated to: " +
// 		channel.gameName
// );
