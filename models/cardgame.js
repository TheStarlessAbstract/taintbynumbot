let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CardSchema = new Schema({
	suit: String,
	value: String,
	rule: String,
	explanation: String,
	isDrawn: Boolean,
	hasAudioAlert: Boolean,
	audioAlert: String,
});

let PrizeSchema = new Schema({
	active: Boolean,
	method: String,
	amount: Number,
	rate: Number,
	lastDrawn: Number,
});

let BonusSchema = new Schema({
	name: String,
	active: Boolean,
	amount: Number,
	appliesTo: String,
	message: String,
	hasAudioAlert: Boolean,
	prize: PrizeSchema,
});

let CardGameSchema = new Schema({
	twitchId: String,
	name: String,
	deck: [CardSchema],
	bonus: [BonusSchema],
});

CardGameSchema.index({ twitchId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("CardGame", CardGameSchema);
