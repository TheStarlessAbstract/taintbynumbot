let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CardSchema = new Schema({
	suit: String,
	value: String,
	rule: String,
	explanation: String,
});

let NewDeckSchema = new Schema({
	cards: [CardSchema],
});

module.exports = mongoose.model("NewDeck", NewDeckSchema);
