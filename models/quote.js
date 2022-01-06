let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let QuoteSchema = new Schema({
	index: {
		type: Number,
	},
	text: String,
	addedBy: String,
});

module.exports = mongoose.model("Quote", QuoteSchema);
