let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let OutputSchema = new Schema({
	message: { type: String, required: true },
	active: { type: Boolean, required: true },
});
let VersionSchema = new Schema({
	description: String,
	active: Boolean,
	usableBy: String, // maybe enum for users, vips, mods, streamer
});

let CommandNewSchema = new Schema({
	streamerId: { type: String, required: true },
	chatName: { type: String, required: true }, // custom command name
	active: Boolean, //can be removed, is included in versions
	name: String, // default command name
	text: String, // only used for chat created commands || could be moved into output [default: text]
	output: { type: Map, of: OutputSchema },
	createdBy: String,
	createdOn: Date,
	lastEditedBy: String,
	lastEditedOn: String,
	versions: [VersionSchema],
});

CommandNewSchema.index({ streamerId: 1, chatName: 1 }, { unique: true });
CommandNewSchema.index({ chatName: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("CommandNew", CommandNewSchema);
