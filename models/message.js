let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let MessageSchema = new Schema({
	text: {
		type: String,
		unique: true,
	},
	addedBy: String,
});

module.exports = mongoose.model("Message", MessageSchema);
