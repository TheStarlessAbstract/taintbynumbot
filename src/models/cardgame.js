let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let BonusCardSchema = new Schema({
	suits: [String], // clubs
	value: { type: String, required: true }, // 7
});

let BonusSchema = new Schema({
	id: { type: Number, required: true },
	name: { type: String, required: true }, // jager, chug
	active: { type: Boolean, required: true },
	amount: { type: Number, required: true }, // Number of occurences of the prize
	reward: Number, // loyalty points rewarded
	cardsIncluded: [BonusCardSchema],
	selector: { type: String, required: true }, // last card, random
	audioName: String, // name of audio associated
});

let ValueSchema = new Schema({
	value: { type: String, required: true }, // ace, 2, 3, 4, 5...
	rule: { type: String, required: true }, // fuck you, fuck me, hydrate...
	explanation: { type: String, required: true }, // choose someone to drink, I drink, drink water...
	audioName: String, // name of audio associated
});

let CardGameNewSchema = new Schema({
	channelId: { type: String, required: true },
	name: { type: String, required: true },
	suits: [String],
	values: [ValueSchema],
	bonus: [BonusSchema],
});

CardGameNewSchema.index({ channelId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("CardGameNew", CardGameNewSchema);
