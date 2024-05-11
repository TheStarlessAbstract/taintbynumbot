const { getStreamByUserId } = require("../../../services/twitch/streams");
const { updateChannelInfo } = require("../../../services/twitch/channels");

const setStreamGame = async function (config) {
	if (config.versionKey !== "setStreamGame") return;
	let output;

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) {
		output = this.getProcessedOutputString(
			this.getOutput("noStream"),
			config.configMap
		);

		return output;
	}

	const name = config.argument
		.toLowerCase()
		.trim()
		.replace(/[^a-zA-Z0-9\s]/g, "");
	const nameParts = name.split(/\s+/).filter((part) => part.trim() !== "");
	const limit = 100;
	const games = await this.gameSearch(name, limit);
	if (!games) {
		output = this.getProcessedOutputString(
			this.getOutput("gameNotFound"),
			config.configMap
		);
		return output;
	}

	let filteredGames = games.filter((game) => {
		return this.fullMatchFilter(name, game);
	});

	if (filteredGames.length === 0) {
		filteredGames = games.filter((game) => {
			return this.starsWithMatchFilter(name, game);
		});
	}

	if (filteredGames.length === 0) {
		filteredGames = games.filter((game) => {
			return this.partMatchFilter(nameParts, game);
		});
	}

	if (filteredGames.length === 0) {
		output = this.getProcessedOutputString(
			this.getOutput("gameNotFound"),
			config.configMap
		);
		return output;
	}

	const game = await this.getByMostViewers(filteredGames);
	if (!game) {
		output = this.getProcessedOutputString(
			this.getOutput("gameNotFound"),
			config.configMap
		);
		return output;
	}
	if (game.name === stream.gameName) return;

	config.configMap.set("newGameName", game.name);
	config.configMap.set("newGameId", game.id);

	output = this.getProcessedOutputString(
		this.getOutput("updateGame"),
		config.configMap
	);

	const data = { gameId: config.configMap.get("newGameId") };
	await updateChannelInfo(config.channelId, data);

	return output;
};

module.exports = setStreamGame;
