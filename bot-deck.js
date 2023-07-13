const Deck = require("./models/deck");

async function getDeck() {
	let deck;

	deck = await Deck.findOne({});

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

exports.getDeck = getDeck;
