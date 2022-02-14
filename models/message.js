let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let MessageSchema = new Schema({
	text: String,
	addedBy: String,
});

module.exports = mongoose.model("Message", MessageSchema);
