const BaseCommand = require("../classes/base-command");
const { updateChannelInfo } = require("../services/twitch/channels");
const { getStreamByUserId } = require("../services/twitch/streams");
const { searchCategories } = require("../services/twitch/search");
const { getProcessedOutputString } = require("../utils");

const commandResponse = async (config) => {
	if (
		config.versionKey !== "noArgument" &&
		config.versionKey !== "stringArgument"
	)
		return;

	let output;
	let outputType;

	if (config.versionKey == "noArgument") {
		let stream = await getStreamByUserId(config.channelId);
		if (!stream) {
			outputType = "noStream";
		} else {
			outputType = "streamIsLive";
		}
	}
	if (config.versionKey == "stringArgument") {
		const game = await searchCategories(config.argument); // find game
		if (!game) {
			outputType = "gameNotFound";
		} else {
			outputType = "gameFound";
			await updateChannelInfo();
		}
	}

	output = getProcessedOutputString(
		config.output.get(outputType),
		config.configMap
	);
	if (!output) return;

	return output;
};

const command = new BaseCommand(commandResponse);

module.exports = command;

////////////////

let gamesPaginated = await apiClient.search.searchCategoriesPaginated(
	config.argument
);

let currentPageGames = await gamesPaginated.getNext();
let pages = 0;

let gameId;
while (currentPageGames.length > 0 && pages < 3) {
	for (let i = 0; i < currentPageGames.length; i++) {
		if (
			helper.startsWithCaseInsensitive(
				currentPageGames[i].name,
				config.argument
			)
		) {
			gameId = currentPageGames[i].id;
			break;
		}
	}

	if (gameId == undefined) {
		currentPageGames = await gamesPaginated.getNext();
		pages++;
	} else {
		break;
	}
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
	result.push("Twitch has not updated the game for reasons - Try again later");
	return result;
}

channel = await apiClient.channels.getChannelInfoById(twitchId);

result.push(
	"@" +
		config.userInfo.displayName +
		" -> The stream game has been updated to: " +
		channel.gameName
);
