let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CardSchema = new Schema({
	suit: String,
	value: String,
	rule: String,
	explanation: String,
});

let DeckSchema = new Schema({
	game: { type: String, unique: true },
	cards: [CardSchema],
});

module.exports = mongoose.model("Deck", DeckSchema);
