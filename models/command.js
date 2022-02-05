let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CommandSchema = new Schema({
	name: {
		type: String,
		unique: true,
	},
	text: String,
	createdBy: String,
});

module.exports = mongoose.model("Command", CommandSchema);
