const { findOne } = require("../../queries/cardGames");
const { getChannel } = require("../../controllers/channels");
const CardGame = require("../../classes/cardGame");

const reset = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	const channel = getChannel(this.channelId);
	let game = channel.getCardGame(this.commandGroup);

	if (game) {
		game.reset();
		return this.getOutputString("reset", config.configMap);
	}

	dbCardGame = await findOne({
		channelId: this.channelId,
		name: this.commandGroup,
	});
	if (!dbCardGame) return this.getOutputString("noGame", config.configMap);

	game = new CardGame(dbCardGame.suits, dbCardGame.values);
	channel.addCardGame(this.name, game);

	return this.getOutputString("newGame", config.configMap);
};

module.exports = reset;
