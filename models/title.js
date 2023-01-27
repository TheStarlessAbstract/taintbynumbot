let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

// create a new schema for the titles
let TitleSchema = new Schema({
	index: {
		type: Number,
	},
	text: {
		type: String,
		unique: true,
	},
	addedBy: String,
});

module.exports = mongoose.model("Title", TitleSchema);
