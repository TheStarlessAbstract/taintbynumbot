let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let AudioLinkNewSchema = new Schema({
	channelId: { type: String, required: true },
	url: { type: String, required: true },
	name: { type: String, required: true },
	channelPointRedeem: String,
	command: String,
	modAction: String,
});

AudioLinkNewSchema.index({ channelId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("AudioLinkNew", AudioLinkNewSchema);
