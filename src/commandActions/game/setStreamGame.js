const { getStreamByUserId } = require("../../services/twitch/streams");
const { updateChannelInfo } = require("../../services/twitch/channels");

const setStreamGame = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) return this.getOutputString("noStream", config.configMap);

	const name = config.argument
		.toLowerCase()
		.trim()
		.replace(/[^a-zA-Z0-9\s]/g, "");
	const nameParts = name.split(/\s+/).filter((part) => part.trim() !== "");
	const limit = 100;
	const games = await this.gameSearch(name, limit);
	if (!games) return this.getOutputString("gameNotFound", config.configMap);

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

	if (filteredGames.length === 0)
		return this.getOutputString("gameNotFound", config.configMap);

	const game = await this.getByMostViewers(filteredGames);
	if (!game) return this.getOutputString("gameNotFound", config.configMap);
	if (game.name === stream.gameName) return;

	config.configMap.set("newGameName", game.name);
	config.configMap.set("newGameId", game.id);

	const data = { gameId: config.configMap.get("newGameId") };
	await updateChannelInfo(config.channelId, data);

	return this.getOutputString("updateGame", config.configMap);
};

module.exports = setStreamGame;
