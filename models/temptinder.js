let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let TempTinderSchema = new Schema({
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

module.exports = mongoose.model("TempTinder", TempTinderSchema);
