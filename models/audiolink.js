let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let AudioLinkSchema = new Schema({
	url: String,
	name: String,
	channelPointRedeem: String,
	command: String,
});

module.exports = mongoose.model("AudioLink", AudioLinkSchema);
