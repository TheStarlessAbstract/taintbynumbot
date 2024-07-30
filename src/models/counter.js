let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CounterSchema = new Schema({
	channelId: { type: String, required: true },
	name: { type: String, required: true },
	count: { type: Number, required: true },
	gameTitle: { type: String, required: true },
	streamStartDate: { type: Date, required: true },
});

CounterSchema.index(
	{ channelId: 1, name: 1, gameTitle: 1, streamStartDate: 1 },
	{ unique: true }
);

module.exports = mongoose.model("Counter", CounterSchema);
