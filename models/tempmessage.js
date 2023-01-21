let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let TempMessageSchema = new Schema({
	text: {
		type: String,
		unique: true,
	},
	addedBy: String,
});

module.exports = mongoose.model("TempMessage", TempMessageSchema);
