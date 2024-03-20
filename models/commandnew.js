let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let OutputSchema = new Schema({
	message: { type: String, required: true },
	active: { type: Boolean, required: true },
});

let CommandNewSchema = new Schema({
	streamerId: { type: String, required: true },
	chatName: { type: String, required: true },
	active: Boolean,
	name: String,
	text: String,
	output: { type: Map, of: OutputSchema },
	createdBy: String,
	createdOn: Date,
	lastEditedBy: String,
	lastEditedOn: String,
});

CommandNewSchema.index({ streamerId: 1, chatName: 1 }, { unique: true });
CommandNewSchema.index({ chatName: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("CommandNew", CommandNewSchema);
