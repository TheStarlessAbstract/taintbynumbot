const BaseCommand = require("./baseCommand.js");
const { updateChannelInfo } = require("../../services/twitch/channels");
const { getStreamByUserId } = require("../../services/twitch/streams");
const { searchCategories } = require("../../services/twitch/search");

async function action(config) {
	if (
		config.versionKey !== "noArgument" &&
		config.versionKey !== "stringArgument"
	)
		return;

	let output;
	let outputType;

	const stream = await getStreamByUserId(config.channelId);
	outputType = "noStream";

	if (config.versionKey == "noArgument" && stream) {
		if (stream) {
			outputType = "streamIsLive";
			config.configMap.set("gameName", stream.gameName);
		}
	}
	if (config.versionKey == "stringArgument" && stream) {
		outputType = "gameNotFound";

		const name = config.argument;
		const input = name
			.toLowerCase()
			.trim()
			.replace(/[^a-zA-Z0-9\s]/g, "");
		const inputParts = input.split(/\s+/).filter((part) => part.trim() !== "");
		const limit = 100;

		const games = await this.gameSearch(name, limit);

		let filteredGames = games.filter((game) => {
			return this.fullMatchFilter(input, game);
		});

		if (filteredGames.length === 0) {
			filteredGames = games.filter((game) => {
				return this.starsWithMatchFilter(input, game);
			});
		}

		if (filteredGames.length === 0) {
			filteredGames = games.filter((game) => {
				return this.partMatchFilter(inputParts, game);
			});
		}

		if (filteredGames.length >= 1) {
			outputType = "existingGame";
			const game = await this.getByMostViewers(filteredGames);
			config.configMap.set("newGameName", game.name);
			config.configMap.set("newGameId", game.id);
			if (game?.name === stream?.gameName) outputType = "updateGame";
		}
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);
	if (!output) outputType == "error";

	if (outputType === "updateGame") {
		const data = { gameId: config.configMap.get("newGameId") };
		await updateChannelInfo(config.channelId, data);
	}

	return output;
}

class Game extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	action = action.bind(this);

	matchStart(query, result) {
		return result.startsWith(query);
	}

	async gameSearch(name, limit) {
		let searchResultCount = limit;
		let searchResults;
		let games = [];

		while (searchResultCount === limit) {
			searchResults = await searchCategories(name, {
				limit,
				after: searchResults?.cursor,
			});

			searchResultCount = searchResults.data.length;
			games = [...games, ...searchResults.data];
		}

		return games;
	}

	fullMatchFilter(input, game) {
		const gameNameLowerCase = game.name
			.toLowerCase()
			.trim()
			.replace(/[^a-zA-Z0-9\s]/g, "");
		return gameNameLowerCase === input;
	}

	starsWithMatchFilter(input, game) {
		const gameNameLowerCase = game.name
			.toLowerCase()
			.trim()
			.replace(/[^a-zA-Z0-9\s]/g, "");
		return gameNameLowerCase.startsWith(input);
	}

	partMatchFilter(parts, game) {
		const gameNameLowerCase = game.name
			.toLowerCase()
			.trim()
			.replace(/[^a-zA-Z0-9\s]/g, "");
		let currentIndex = 0;

		for (const part of parts) {
			const index = gameNameLowerCase.indexOf(part, currentIndex);
			if (index === -1) {
				return false;
			}
			currentIndex = index + part.length;
		}

		return true;
	}

	async getByMostViewers(array) {
		if (array.length === 1) return array[0];

		let gameStreams;
		let gameRanking = [];
		for (let i = 0; i < array.length; i++) {
			gameStreams = await array[i].getStreams();
			let viewers = 0;
			for (let j = 0; j < gameStreams.data.length; j++) {
				viewers += gameStreams.data[j].viewers;
			}

			gameRanking.push({
				id: array[i].id,
				name: array[i].name,
				viewers: viewers,
			});
		}
		gameRanking.sort((a, b) => b.viewers - a.viewers);

		return gameRanking[0];
	}
}

module.exports = Game;
