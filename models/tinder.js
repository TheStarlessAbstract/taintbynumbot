let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let TinderSchema = new Schema({
	index: {
		type: Number,
	},
	text: {
		type: String,
		unique: true,
	},
	user: String,
	addedBy: String,
});

module.exports = mongoose.model("Tinder", TinderSchema);
