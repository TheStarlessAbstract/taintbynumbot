const Deck = require("./bot-deck");
const Helper = require("./classes/helper");
const KingsSaveState = require("./models/kingssavestate");
const helper = new Helper();

async function getGameState() {
	let gameState;
	gameState = await KingsSaveState.findOne({});

	if (!gameState) {
		gameState = await initializeGameState();
	} else {
		await KingsSaveState.deleteOne({ _id: gameState._id });
	}

	return gameState;
}

async function initializeGameState() {
	let gameState = { kingsCount: 0 };
	let gameDeck = await Deck.getDeck();
	let cardsToDraw = [];
	let jagerBonusCards = [];

	for (let i = 0; i < gameDeck.cards.length; i++) {
		if (gameDeck.cards[i].explanation === "Hydrate you fools") {
			jagerBonusCards.push(i);
		}

		cardsToDraw.push({
			suit: gameDeck.cards[i].suit,
			value: gameDeck.cards[i].value,
			rule: gameDeck.cards[i].rule,
			explanation: gameDeck.cards[i].explanation,
			isDrawn: false,
			bonusJager: false,
		});
	}

	cardsToDraw = jagerBonus(cardsToDraw, jagerBonusCards);
	cardsToDraw = helper.shuffle(cardsToDraw);
	gameState.cardsToDraw = cardsToDraw;

	return gameState;
}

function jagerBonus(cardsToDraw, bonusArray) {
	let index;
	for (let i = 0; i < 2; i++) {
		index = helper.getRandomBetweenExclusiveMax(0, bonusArray.length);
		cardsToDraw[bonusArray[index]].bonusJager = true;
		bonusArray.splice(index, 1);
	}
	return cardsToDraw;
}

async function saveKingsState(cardsToDraw, kingsCount) {
	let saveState = new KingsSaveState({
		cardsToDraw: cardsToDraw,
		kingsCount: kingsCount,
	});

	await saveState.save();
}

exports.getGameState = getGameState;
exports.saveKingsState = saveKingsState;
