let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CommandSchema = new Schema({
	streamerId: { type: String, required: true },
	name: { type: String, required: true },
	text: { type: String, required: true },
	createdBy: { type: String, required: true },
	createdOn: { type: Date, required: true },
	lastEditedBy: String,
	lastEditEdOn: String,
});

CommandSchema.index({ streamerId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Command", CommandSchema);

// ORIGINAL
// let mongoose = require("mongoose"),
// 	Schema = mongoose.Schema;

// let CommandSchema = new Schema({
// 	name: {
// 		type: String,
// 		unique: true,
// 	},
// 	text: String,
// 	createdBy: String,
// });

// module.exports = mongoose.model("Command", CommandSchema);
