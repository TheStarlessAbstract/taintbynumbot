let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let MessageSchema = new Schema({
	index: { type: Number, unique: true },
	text: {
		type: String,
		unique: true,
	},
	addedBy: String,
});

module.exports = mongoose.model("Message", MessageSchema);
