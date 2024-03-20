let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CardSchema = new Schema({
	suit: String,
	value: String,
	rule: String,
	explanation: String,
});

let DeckSchema = new Schema({
	twitchId: String,
	gamename: String,
	cards: [CardSchema],
});

DeckSchema.index({ twitchId: 1, gamename: 1 }, { unique: true });

module.exports = mongoose.model("Deck", DeckSchema);
