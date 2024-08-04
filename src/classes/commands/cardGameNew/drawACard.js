const { findOne } = require("./../../../queries/cardGames");
const loyaltyPoints = require("../../../queries/loyaltyPoints");
const { getChannel } = require("./../../../controllers/channels");
const { getStreamByUserId } = require("../../../services/twitch/streams");
const { play } = require("../../../services/audio");
const CardGame = require("./../../cardGame");
const Channel = require("../../channel");

const drawACard = async function (config) {
	if (config.versionKey !== "drawACard") return;

	const stream = await getStreamByUserId(this.channelId);
	if (!stream)
		return this.getProcessedOutputString(
			this.getOutput("noStream"),
			config.configMap
		);

	if (!config?.permitted || typeof config.permitted !== "boolean") {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	const channel = getChannel(this.channelId);
	if (!(channel instanceof Channel)) return;

	let game = channel.getCardGame(this.name);

	if (!(game instanceof CardGame)) {
		dbCardGame = await findOne({
			channelId: this.channelId,
			name: this.name,
		});
		if (!dbCardGame)
			return this.getProcessedOutputString(
				this.getOutput("noGame"),
				config.configMap
			);

		const { suits, values, bonus } = dbCardGame;
		game = new CardGame(this.channelId, suits, values, bonus);
		channel.addCardGame(this.name, game);
	}

	const drawn = await game.drawCard(); // bonus = [{audioLink, selector}]

	if (!this.validateCard(drawn)) return;
	const { card, reset, bonus } = drawn;

	config.configMap.set("suit", card.suit);
	config.configMap.set("value", card.value);
	config.configMap.set("rule", card.rule);
	config.configMap.set("explanation", card.explanation);

	const output = [
		this.getProcessedOutputString(this.getOutput("card"), config.configMap),
		this.getProcessedOutputString(this.getOutput("rule"), config.configMap),
	];

	const audioLinkUrls = [];
	let audioUrl;
	if (card.audioName) audioUrl = await this.getAudioUrl(card.audioName);
	if (audioUrl) audioLinkUrls.push(audioUrl);

	const dbUser = await loyaltyPoints.findOne(
		{
			channelId: this.chanelId,
			viewerId: config.userId,
		},
		{ points: 1 }
	);

	for (let i = 0; i < bonus.length; i++) {
		if (bonus[i]?.audioLink) audioLinkUrls.push(bonus[i].audioLink);

		if (bonus[i]?.reward && dbUser) {
			config.configMap.set("prize", bonus[i].reward);
			config.configMap.set("total", dbUser.points);
			dbUser.points += bonus[i].reward;
			config.configMap.set("newTotal", dbUser.points);
			output.push(
				this.getProcessedOutputString(
					this.getOutput(`bonus${bonus[i].id}`),
					config.configMap
				)
			);
		}
	}

	if (dbUser) await dbUser.save();

	if (reset) {
		output.push(
			this.getProcessedOutputString(this.getOutput("newGame"), config.configMap)
		);
	}

	// play(this.channelId, audioLinkUrls); // update function for array of URLs

	return output;
};

module.exports = drawACard;
