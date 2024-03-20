let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CardSchema = new Schema({
	suit: String,
	value: String,
	rule: String,
	explanation: String,
});

let DeckTempSchema = new Schema({
	twitchId: String,
	gamename: String,
	cards: [CardSchema],
});

DeckTempSchema.index({ twitchId: 1, gamename: 1 }, { unique: true });

module.exports = mongoose.model("DeckTemp", DeckTempSchema);
