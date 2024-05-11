const BaseCommand = require("../baseCommand.js");
const { searchCategories } = require("../../../services/twitch/search");

class Game extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

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
