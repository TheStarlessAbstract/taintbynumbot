const { findOne } = require("./../../../queries/cardGames");
const { getChannel } = require("./../../../controllers/channels");
const CardGame = require("./../../cardGame");

const reset = async function (config) {
	if (config.versionKey !== "reset") return;

	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	const channel = getChannel(this.channelId);
	let game = channel.getCardGame(this.commandGroup);

	if (game) {
		game.reset();
		return this.getProcessedOutputString(
			this.getOutput("reset"),
			config.configMap
		);
	}

	dbCardGame = await findOne({
		channelId: this.channelId,
		name: this.commandGroup,
	});
	if (!dbCardGame)
		return this.getProcessedOutputString(
			this.getOutput("noGame"),
			config.configMap
		);

	game = new CardGame(dbCardGame.suits, dbCardGame.values);
	channel.addCardGame(this.name, game);

	return this.getProcessedOutputString(
		this.getOutput("newGame"),
		config.configMap
	);
};

module.exports = reset;
