const CardGame = require("./../../cardGame");
const Channel = require("../../channel");
const { findOne } = require("./../../../queries/cardGames");
const loyaltyPoints = require("../../../queries/loyaltyPoints");
const { getChannel } = require("./../../../controllers/channels");
const { getStreamByUserId } = require("../../../services/twitch/streams");
const { play } = require("../../../services/audio");

const drawACard = async function (config) {
	// config properties used { configMap, permitted, userId }

	const stream = await getStreamByUserId(this.channelId);
	// check if stream live
	if (!stream) return this.getOutputString("noStream", config.configMap);

	// check if permitted
	if (!config?.permitted || typeof config.permitted !== "boolean") {
		return this.getOutputString("notPermitted", config.configMap);
	}

	const channel = getChannel(this.channelId);
	// check if channel valid instance
	console.log(Channel);
	if (!(channel instanceof Channel)) return;
	let game = channel.getCardGame(this.name);

	//check if game valid instance
	if (!(game instanceof CardGame)) {
		dbCardGame = await findOne({
			channelId: this.channelId,
			name: this.name,
		});
		// check if cardGame in database
		if (!dbCardGame) return this.getOutputString("noGame", config.configMap);

		const { suits, values, bonus } = dbCardGame;
		game = new CardGame(this.channelId, suits, values, bonus);
		channel.addCardGame(this.name, game);
	}

	// drawn.bonus = [ { audioLink, selector } ]
	const drawn = await game.drawCard();
	if (!this.validateCard(drawn)) return;
	const { card, reset, bonus } = drawn;

	config.configMap.set("suit", card.suit);
	config.configMap.set("value", card.value);
	config.configMap.set("rule", card.rule);
	config.configMap.set("explanation", card.explanation);

	const output = [
		this.getOutputString("card", config.configMap),
		this.getOutputString("rule", config.configMap),
	];

	const audioLinkUrls = [];
	let audioUrl;
	// check if card has audio alert
	if (card.audioName) audioUrl = await this.getAudioUrl(card.audioName);
	// check if audio alert found add us array
	if (audioUrl) audioLinkUrls.push(audioUrl);

	// query database for loyatlyPoints for user
	const dbUser = await loyaltyPoints.findOne(
		{
			channelId: this.chanelId,
			viewerId: config.userId,
		},
		{ points: 1 }
	);

	// if card has at least 1 bonus
	for (let i = 0; i < bonus.length; i++) {
		// check if bonus has audio alert, add to array if so
		if (bonus[i]?.audioLink) audioLinkUrls.push(bonus[i].audioLink);

		// check if bonus has a reward
		if (bonus[i]?.reward && dbUser) {
			config.configMap.set("prize", bonus[i].reward);
			config.configMap.set("total", dbUser.points);
			dbUser.points += bonus[i].reward;
			config.configMap.set("newTotal", dbUser.points);
			output.push(
				this.getOutputString(`bonus${bonus[i].id}`, config.configMap)
			);
		}
	}

	if (dbUser) await dbUser.save();
	if (reset) {
		output.push(this.getOutputString("newGame", config.configMap));
	}
	if (audioLinkUrls.length > 0) play(this.channelId, audioLinkUrls); // update function for array of URLs

	return output;
};

module.exports = drawACard;
