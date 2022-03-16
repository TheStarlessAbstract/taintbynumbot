let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CardSchema = new Schema({
	suit: String,
	value: String,
	rule: String,
	game: String,
});

module.exports = mongoose.model("Card", CardSchema);
