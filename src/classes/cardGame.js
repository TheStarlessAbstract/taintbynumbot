const CardGameBonus = require("./cardGameBonus");
const getRandomBetweenInclusiveMax = require("./../utils/getRandomBetweenInclusiveMax");

class CardGame {
	constructor(channelId, suits, values, bonus) {
		this.deck = [];
		this.bonus = [];
		this.createCards(suits, values);
		this.createBonus(channelId, bonus);
		this.shuffle();
	}

	createCards(suits, values) {
		const cards = [];
		for (let i = 0; i < suits.length; i++) {
			for (let j = 0; j < values.length; j++) {
				let { value, rule, explanation, audioNames } = values[j];
				cards.push({
					suit: suits[i],
					value,
					rule,
					explanation,
					audioNames,
					isDrawn: false,
				});
			}
		}
		this.deck = cards;
	}

	createBonus(channelId, bonus) {
		const newBonus = [];
		for (let i = 0; i < bonus.length; i++) {
			newBonus.push(new CardGameBonus(channelId, bonus[i]));
		}

		this.bonus = newBonus;
	}

	shuffle() {
		let m = this.deck.length,
			t,
			i;

		while (m) {
			i = Math.floor(Math.random() * m--);

			t = this.deck[m];
			this.deck[m] = this.deck[i];
			this.deck[i] = t;
		}
	}

	async drawCard() {
		const availableCards = this.deck.filter((card) => card.isDrawn === false);
		const cardDrawn =
			availableCards[
				getRandomBetweenInclusiveMax(0, availableCards.length - 1)
			];

		const cardBonus = await this.checkCardForBonus(cardDrawn);
		let bonusWin;
		const bonusDetails = [];
		for (let i = 0; i < cardBonus.length; i++) {
			bonusWin = await cardBonus[i].checkIfBonusWinner(cardDrawn);
			if (!bonusWin) continue;
			bonusDetails.push(bonusWin);
		}

		cardDrawn.isDrawn = true;
		const gameReset = availableCards.length === 1 ? true : false;
		if (gameReset) this.reset();
		return { card: cardDrawn, reset: gameReset, bonus: bonusDetails };
	}

	reset() {
		for (let i = 0; i < this.deck.length; i++) {
			this.deck[i].isDrawn = false;
		}
		for (let i = 0; i < this.bonus.length; i++) {
			this.bonus[i].resetBonus();
		}

		this.shuffle();
	}

	remainingCards() {
		return this.deck.filter((card) => card.isDrawn === false).length;
	}

	async checkCardForBonus(card) {
		const matchedBonus = [];
		for (let i = 0; i < this.bonus.length; i++) {
			const cardBonusMatch = this.bonus[i].checkBonus(card);
			if (cardBonusMatch) matchedBonus.push(this.bonus[i]);
		}
		return matchedBonus;
	}
}

module.exports = CardGame;
