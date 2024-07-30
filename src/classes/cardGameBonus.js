const { findOne } = require("./../queries/audioLinks");
const getRandomBetweenInclusiveMax = require("./../utils/getRandomBetweenInclusiveMax");

class CardGameBonus {
	constructor(channelId, bonus) {
		this.channelId = channelId;
		this.id = bonus.id;
		this.name = bonus.name;
		this.active = bonus.active;
		this.amount = bonus.amount;
		this.reward = bonus.reward;
		this.selector = bonus.selector;
		this.audioName = bonus.audioName;
		this.cardsIncluded = [];
		this.createCardsIncluded(bonus.cardsIncluded);
	}

	createCardsIncluded(cards) {
		for (let i = 0; i < cards.length; i++) {
			for (let j = 0; j < cards[i].suits.length; j++) {
				const card = {
					suit: cards[i].suits[j],
					value: cards[i].value,
					isDrawn: false,
				};
				if (this.selector === "random") card.isRandomPick = false;
				this.cardsIncluded.push(card);
			}
		}

		if (this.selector === "random") this.assignBonus();
	}

	checkBonus(card) {
		const checkedBonus = this.matchCard(card);
		if (!checkedBonus) return false;
		checkedBonus.isDrawn = true;

		return true;
	}

	async checkIfBonusWinner(card) {
		let winDetails;

		if (this.selector === "lastCard") winDetails = await this.handleLastCard();
		else if (this.selector === "random")
			winDetails = await this.handleRandom(card);

		return winDetails;
	}

	async handleLastCard() {
		if (this.cardsIncluded.length !== 0) return;
		const audioLinkUrl = await this.getAudioLink();
		this.active = false;
		return { id: this.id, reward: this.reward, audioLink: audioLinkUrl };
	}

	async handleRandom(card) {
		const possibleRandomPick = this.matchCard(card);
		if (!possibleRandomPick.isRandomPick) return;

		const audioLinkUrl = await this.getAudioLink();
		const availableCards = this.getAvailableCards();
		if (availableCards.length === 0) this.active = false;
		return { id: this.id, reward: this.reward, audioLink: audioLinkUrl };
	}

	async getAudioLink() {
		const dbAudioLink = await findOne({
			channelId: this.channelId,
			name: this.audioName,
		});
		return dbAudioLink.url;
	}

	resetBonus() {
		for (let i = 0; i < this.cardsIncluded.length; i++) {
			this.cardsIncluded[i].isDrawn = false;
		}
	}

	assignBonus() {
		for (let i = 0; i < this.amount; i++) {
			const availableCards = this.getAvailableCards();
			const randomPick =
				availableCards[
					getRandomBetweenInclusiveMax(0, availableCards.length - 1)
				];
			randomPick.isRandomPick = true;
		}
	}

	getAvailableCards() {
		return this.cardsIncluded.filter((card) => card.isRandomPick === false);
	}

	matchCard(card) {
		return this.cardsIncluded.find(
			(cardIncluded) =>
				card.suit.toLowerCase() === cardIncluded.suit.toLowerCase() &&
				card.value.toLowerCase() === cardIncluded.value.toLowerCase()
		);
	}
}

module.exports = CardGameBonus;
