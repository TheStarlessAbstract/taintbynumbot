require("dotenv").config();

const axios = require("axios");

const AudioLink = require("./models/audiolink");
const Deck = require("./models/deck");

let audioLinks;
let lastAudioPlayed;
let audioLink;
let url = process.env.BOT_DOMAIN;
let apiClient;
let twitchId = process.env.TWITCH_USER_ID;
let twitchUsername = process.env.TWITCH_USERNAME;
let higherLower = getRandom();
let predictionWinner;
let chatClient;
let audioTimeout = false;
let audioTimeoutPeriod = 10000;
let audioTimeoutActive = false;
let deck;
let cardsToDraw = [];
let kingsCount;
let redeemUser;

async function setup(pubSubClient, userId) {
	audioLinks = await AudioLink.find({});
	lastAudioPlayed = new Date().getTime();

	const listener = await pubSubClient.onRedemption(userId, async (message) => {
		redeemUser = message.userName;
		audioLink = audioLinks.find(
			(element) => element.channelPointRedeem == message.rewardTitle
		);

		if (audioLink) {
			if (audioTimeout) {
				if (new Date().getTime() - lastAudioPlayed >= audioTimeoutPeriod) {
					audioTimeoutActive = false;
				} else {
					audioTimeoutActive = true;
				}
			} else {
				audioTimeoutActive = false;
			}

			if (!audioTimeoutActive) {
				lastAudioPlayed = new Date().getTime();

				audioLink = audioLinks.find(
					(element) => element.channelPointRedeem == message.rewardTitle
				);

				let resp = await axios.post(url + "/playaudio", { url: audioLink.url });
			}
		} else if (message.rewardTitle.includes("Higher or Lower")) {
			let latestPredictions = await apiClient.predictions
				.getPredictionsPaginated(twitchId)
				.getNext();

			if (
				latestPredictions[0].status != "LOCKED" &&
				latestPredictions[0].status != "ACTIVE"
			) {
				let prediction = await apiClient.predictions.createPrediction(
					twitchId,
					{
						autoLockAfter: 30,
						outcomes: ["Higher", "Lower"],
						title: "Higher or Lower than " + higherLower,
					}
				);
				setTimeout(async () => {
					let newRoll = getRandom();
					while (newRoll == higherLower) {
						newRoll = getRandom();
					}
					if (newRoll > higherLower) {
						predictionWinner = prediction.outcomes.find(
							(outcome) => outcome.title == "Higher"
						);
					} else if (newRoll < higherLower) {
						predictionWinner = prediction.outcomes.find(
							(outcome) => outcome.title == "Lower"
						);
					}
					higherLower = newRoll;

					await apiClient.predictions.resolvePrediction(
						twitchId,
						prediction.id,
						predictionWinner.id
					);

					chatClient.say(
						twitchUsername,
						" The result is in, we rolled a " + higherLower
					);

					await apiClient.channelPoints.updateCustomReward(
						twitchId,
						message.rewardId,
						{ title: "Higher or Lower: " + higherLower }
					);
				}, 32000);
			} else {
				await apiClient.channelPoints.updateRedemptionStatusByIds(
					twitchId,
					message.rewardId,
					[message.id],
					"CANCELED"
				);

				chatClient.say(
					twitchUsername,
					"@" +
						message.userDisplayName +
						" there is already a prediction ongoing, try again later"
				);
			}
		} else if (message.rewardTitle.includes("Kings: Draw a card")) {
			let channelInfo = await apiClient.channels.getChannelInfo(twitchId);
			let gameTitle = channelInfo.gameName;

			if (deck.game != gameTitle) {
				deck = await Deck.findOne({ game: gameTitle });

				if (!deck) {
					createDeck(gameTitle);
				}

				for (let i = 0; i < cardsToDraw.length; i++) {
					for (let j = 0; j < deck.cards.length; j++) {
						if (
							cardsToDraw[i].suit == deck.cards[j].suit &&
							cardsToDraw[i].value == deck.cards[j].value
						) {
							cardsToDraw[i].rule = deck.cards[j].rule;
							cardsToDraw[i].explanation = deck.cards[j].explanation;
						}
					}
				}

				let newCards = deck.cards.filter((card) => {
					let isNotIncluded = true;
					for (let i = 0; i < cardsToDraw.length; i++) {
						if (
							card.suit == cardsToDraw[i].suit &&
							card.value == cardsToDraw[i].value
						) {
							isNotIncluded = false;
						}
					}

					if (isNotIncluded && card.rule == "") {
						isNotIncluded = false;
					}
					return isNotIncluded;
				});

				cardsToDraw = cardsToDraw.filter((card) => card.rule != "");

				if (newCards.length > 0) {
					newCards.forEach((card, index) => {
						newCards[index] = {
							suit: card.suit,
							value: card.value,
							rule: card.rule,
							explanation: card.explanation,
							isDrawn: false,
						};
					});

					cardsToDraw = cardsToDraw.concat(newCards);
					shuffle();
				}
			}

			let drawFrom = cardsToDraw.filter((card) => card.isDrawn == false);
			let cardDrawn = drawFrom[Math.floor(Math.random() * drawFrom.length)];
			cardDrawn.isDrawn = true;

			if (cardDrawn.value == "King") {
				kingsCount++;
			}

			chatClient.say(
				twitchUsername,
				"@" +
					redeemUser +
					" You have drawn the " +
					cardDrawn.value +
					" of " +
					cardDrawn.suit
			);

			if (kingsCount != 4) {
				if (cardDrawn.rule != "") {
					chatClient.say(
						twitchUsername,
						"Rule: " + cardDrawn.rule + " || " + cardDrawn.explanation
					);
				} else {
					chatClient.say(
						twitchUsername,
						"Rule: This card doesn't really have a rule || Hydrate you fools"
					);
				}
			} else {
				chatClient.say(
					twitchUsername,
					"King number 4, time for Starless to chug, but not chug, because he can't chug. Pfft, can't chug."
				);

				kingsCount = 0;
			}

			if (cardsToDraw.filter((card) => card.isDrawn == false).length == 0) {
				resetKings();
			}
		}
	});

	let rewards = await apiClient.channelPoints.getCustomRewards(twitchId);
	let reward = rewards.find((r) => r.title.includes("Higher or Lower"));
	await apiClient.channelPoints.updateCustomReward(twitchId, reward.id, {
		title: "Higher or Lower: " + higherLower,
	});

	return listener;
}

async function setApiClient(newApiClient) {
	apiClient = newApiClient;

	// await apiClient.channelPoints.createCustomReward(twitchId, {
	// 	cost: 1,
	// 	title: "Higher or Lower than " + higherLower,
	// 	autoFullfill: false,
	// 	backgroundColor: "#392e5c",
	// 	globalCooldown: null,
	// 	isEnabled: true,
	// 	maxRedemptionsPerStream: null,
	// 	maxRedemptionsPerUserPerStream: null,
	// 	prompt: "Come gamble your Taintified Essence",
	// 	userInputRequired: false,
	// });
}

function setChatClient(newChatClient) {
	chatClient = newChatClient;
}

function getAudioTimeout() {
	return audioTimeout;
}

function setAudioTimeout(newAudioTimeoutPeriod) {
	audioTimeoutPeriod = newAudioTimeoutPeriod * 1000 || 10000;
	if (audioTimeout) {
		audioTimeout = false;
	} else {
		audioTimeout = true;
	}
}

function getRandom() {
	return Math.floor(Math.random() * 100) + 1;
}

async function resetKings() {
	let channelInfo = await apiClient.channels.getChannelInfo(twitchId);
	let gameTitle = channelInfo.gameName;

	cardsToDraw = [];
	kingsCount = 0;

	if (!deck || deck.game != gameTitle) {
		deck = await Deck.findOne({ game: gameTitle });
	}

	if (!deck) {
		await createDeck(gameTitle);
	}

	for (let i = 0; i < deck.cards.length; i++) {
		cardsToDraw.push({
			suit: deck.cards[i].suit,
			value: deck.cards[i].value,
			rule: deck.cards[i].rule,
			explanation: deck.cards[i].explanation,
			isDrawn: false,
		});
	}

	shuffle();

	chatClient.say(
		twitchUsername,
		"A new game of Kings has been dealt, with " + cardsToDraw.length + " cards!"
	);
}

async function createDeck(gameTitle) {
	deck = new Deck({ game: gameTitle, cards: [] });

	let baseDeck = await Deck.findOne({ game: "base deck" });

	for (let i = 0; i < baseDeck.cards.length; i++) {
		deck.cards.push({
			suit: baseDeck.cards[i].suit,
			value: baseDeck.cards[i].value,
			rule: baseDeck.cards[i].rule,
			explanation: baseDeck.cards[i].explanation,
		});
	}

	await deck.save();
}

function shuffle() {
	let m = cardsToDraw.length,
		t,
		i;

	while (m) {
		i = Math.floor(Math.random() * m--);

		t = cardsToDraw[m];
		cardsToDraw[m] = cardsToDraw[i];
		cardsToDraw[i] = t;
	}
}

async function addKingsRule(value, rule) {
	let channelInfo = await apiClient.channels.getChannelInfo(twitchId);
	let gameTitle = channelInfo.gameName;
	let response;

	if (deck.game != gameTitle) {
		deck = await Deck.findOne({ game: gameTitle });
	}

	if (!deck) {
		createDeck(gameTitle);
	}

	for (let i = 0; i < deck.cards.length; i++) {
		if (value == deck.cards[i].value && deck.cards[i].rule == "") {
			deck.cards[i].rule = rule;
			cardsToDraw.push({
				suit: deck.cards[i].suit,
				value: deck.cards[i].value,
				rule: deck.cards[i].rule,
				explanation: deck.cards[i].explanation,
				isDrawn: false,
			});

			shuffle();

			await deck.save();
			reponse = true;
		} else if (value == deck.cards[i].value && deck.cards[i].rule != "") {
			reponse = false;
		} else {
			response = false;
		}
	}
	return response;
}

exports.setup = setup;
exports.setApiClient = setApiClient;
exports.setChatClient = setChatClient;
exports.getAudioTimeout = getAudioTimeout;
exports.setAudioTimeout = setAudioTimeout;
exports.resetKings = resetKings;
exports.addKingsRule = addKingsRule;

// let test = {
//     channelId: message.channelId,
//     id: message.id,
//     message: message.message,
//     redemptionDate: message.redemptionDate,
//     rewardCost: message.rewardCost,
//     rewardId: message.rewardId,
//     rewardIsQueued: message.rewardIsQueued,
//     rewardPrompt: message.rewardPrompt,
//     rewardTitle: message.rewardTitle,
//     status: message.status,
//     userDisplayName: message.userDisplayName,
//     userId: message.userId,
//     userName: message.userName,
// };
