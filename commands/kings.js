const audio = require("../bot-audio");

const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const AudioLink = require("../models/audiolink");
const Deck = require("../models/deck");
const KingsSaveState = require("../models/kingssavestate");
const LoyaltyPoint = require("../models/loyaltypoint");

const helper = new Helper();

let cardsToDraw;
let cooldown = 5000;
let cost = 100;
let kingsCount;
let currentTime = new Date();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			currentTime = new Date();

			if (
				helper.isCooldownPassed(
					currentTime,
					kings.getTimer(),
					kings.getCooldown()
				) ||
				helper.isStreamer(config.userInfo)
			) {
				kings.setTimer(currentTime);
				let redeemUser = config.userInfo.displayName;
				let canDraw = false;

				if (!helper.isStreamer(config.userInfo)) {
					let user = await LoyaltyPoint.findOne({
						userId: config.userInfo.userId,
					});

					if (user) {
						if (user.points >= cost) {
							user.points -= cost;

							await user.save();

							canDraw = true;
						} else {
							result.push(
								"@" +
									config.userInfo.displayName +
									" You lack the points to draw a card, hang about stream if you have nothing better to do, eventually you may be able to find a Jagerbomb"
							);
						}
					} else {
						result.push(
							"@" +
								config.userInfo.displayName +
								" I hate to say it, but it looks like you haven't been here for a whole 5 minutes yet. Hang around a bit longer to get your self some Tainty Points."
						);
					}
				} else {
					canDraw = true;
				}

				if (canDraw) {
					let drawFrom = cardsToDraw.filter((card) => card.isDrawn == false);
					let cardDrawn;

					if (drawFrom.length == 1) {
						cardDrawn = drawFrom[0];
						deal();
					} else {
						cardDrawn =
							drawFrom[
								helper.getRandomBetweenInclusiveMax(0, drawFrom.length - 1)
							];
					}

					cardDrawn.isDrawn = true;

					if (cardDrawn.value == "King") {
						kingsCount++;
					}

					result.push(
						"@" +
							redeemUser +
							" You have drawn the " +
							cardDrawn.value +
							" of " +
							cardDrawn.suit
					);

					if (kingsCount != 4) {
						result.push(
							"Rule: " + cardDrawn.rule + " || " + cardDrawn.explanation
						);

						switch (cardDrawn.value) {
							case "Queen":
								playAudio("Check out the big brain Brad");
								break;
							case "Ace":
								playAudio("The Greater Good");
								break;
						}

						if (cardDrawn.bonusJager) {
							playAudio("jager");
							result.push(
								"A wild Jagerbomb appears, Starless uses self-control. Was it effective?"
							);
						}
					} else {
						kingsCount = 0;

						result.push(
							"King number 4, time for Starless to chug, but not chug, because he can't chug. Pfft, can't chug."
						);
					}
				}
			}
			return result;
		},
	};
};

let versions = [
	{
		description: "Draw a card in the Kings game",
		usage: "!kings",
		usableBy: "users",
		cost: "100 Tainty Points",
		active: true,
	},
];

const kings = new TimerCommand(commandResponse, versions, cooldown);

kings.setTimer(currentTime);

async function resetKings() {
	let gameState = await KingsSaveState.findOne({});

	if (!gameState) {
		await initializeGameState();
	} else {
		restoreGameState(gameState);
		await KingsSaveState.deleteOne({ _id: gameState._id });
	}
}

function deal() {
	let jagerBonusCards = [];
	cardsToDraw.forEach((card, index) => {
		card.isDrawn = false;
		card.bonusJager = false;

		if (card.explanation === "Hydrate you fools") {
			jagerBonusCards.push(index);
		}
	});

	jagerBonus(jagerBonusCards);

	shuffle();
}

async function initializeGameState() {
	let deck = await createDeck();

	cardsToDraw = [];
	kingsCount = 0;

	let jagerBonusCards = [];
	for (let i = 0; i < deck.cards.length; i++) {
		if (deck.cards[i].explanation === "Hydrate you fools") {
			jagerBonusCards.push(i);
		}

		cardsToDraw.push({
			suit: deck.cards[i].suit,
			value: deck.cards[i].value,
			rule: deck.cards[i].rule,
			explanation: deck.cards[i].explanation,
			isDrawn: false,
			bonusJager: false,
		});
	}

	jagerBonus(jagerBonusCards);

	shuffle();
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

function jagerBonus(bonusArray) {
	let index;
	for (let i = 0; i < 2; i++) {
		index = helper.getRandomBetweenExclusiveMax(0, bonusArray.length);
		cardsToDraw[bonusArray[index]].bonusJager = true;
		bonusArray.splice(index, 1);
	}
}

async function createDeck() {
	let deck = await Deck.findOne({});

	if (!deck) {
		let suits = getSuits();
		let values = getValues();
		deck = new Deck({ cards: [] });
		suits.forEach((suit) => {
			values.forEach((value) => {
				deck.cards.push({
					suit: suit,
					value: value.value,
					rule: value.rule,
					explanation: value.explanation,
				});
			});
		});

		await deck.save();
	}

	return deck;
}

function getCardsToDraw() {
	return cardsToDraw;
}

async function playAudio(audioName) {
	if (!helper.isTest()) {
		let audioLink = await AudioLink.findOne({
			name: audioName,
		});

		audio.play(audioLink.url);
	}
}

function getSuits() {
	return ["Clubs", "Diamonds", "Hearts", "Spades"];
}

function getValues() {
	return [
		{
			value: "Ace",
			rule: "Musketeers: All for one and one for all",
			explanation: "Everybody drinks",
		},
		{
			value: "2",
			rule: "Fuck you!",
			explanation:
				"Choose someone to take a drink...but fuck Starless mainly amirite?!",
		},
		{
			value: "3",
			rule: "Fuck me!",
			explanation: "You drew this card, so you drink!",
		},
		{
			value: "4",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
		},
		{
			value: "5",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
		},
		{
			value: "6",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
		},
		{
			value: "7",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
		},
		{
			value: "8",
			rule: "Pick a mate!",
			explanation:
				"You and a person of your choosing takes a drink...tell us why it is Starless",
		},
		{
			value: "9",
			rule: "Bust a rhyme!",
			explanation:
				"Quickfire rhyming between you and Starless, whoever takes too long has to drink",
		},
		{
			value: "10",
			rule: "Make a rule!",
			explanation:
				"You get to make a rule for Starless, and maybe chat. Rule last until the next 10 is drawn, stream ends, or Starless gets tired of it",
		},
		{
			value: "Jack",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
		},
		{
			value: "Queen",
			rule: "Ask a question!",
			explanation:
				"Ask Starless a general knowledge question. Starless gets it right, you drink, Starless gets it wrong, Starless drinks",
		},
		{
			value: "King",
			rule: "Kings!",
			explanation:
				"The first three Kings drawn mean nothing, Starless may offer a sympathy drink. Draw the fourth King, and Starless owes a 'Chug, but not a chug, because Starless can't chug'",
		},
	];
}

async function saveKingsState() {
	let saveState = new KingsSaveState({
		cardsToDraw: cardsToDraw,
		kingsCount: kingsCount,
	});

	await saveState.save();
}

function restoreGameState(gameState) {
	cardsToDraw = gameState.cardsToDraw;
	kingsCount = gameState.kingsCount;
}

exports.command = kings;
exports.getCardsToDraw = getCardsToDraw;
exports.saveKingsState = saveKingsState;
exports.resetKings = resetKings;
