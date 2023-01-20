let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let TempQuoteSchema = new Schema({
	index: {
		type: Number,
	},
	text: {
		type: String,
		unique: true,
	},
	addedBy: String,
});

module.exports = mongoose.model("TempQuote", TempQuoteSchema);
