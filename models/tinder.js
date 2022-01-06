let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let TinderSchema = new Schema({
	index: {
		type: Number,
	},
	text: String,
	user: String,
	addedBy: String,
});

module.exports = mongoose.model("Tinder", TinderSchema);
