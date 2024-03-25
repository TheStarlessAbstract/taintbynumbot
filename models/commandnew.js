let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let OutputSchema = new Schema({
	message: { type: String, required: true },
	active: { type: Boolean, required: true },
});
let VersionSchema = new Schema({
	description: { type: String, required: true }, // what is the purpose of this version of the command
	active: { type: Boolean, required: true }, // can this command be used in chat
	minimumPermissionLevel: {
		type: String,
		required: true,
		enum: ["users", "artist", "vips", "mods", "streamer"], // maybe not needed, as would prevent custom
		default: "streamer",
	}, // minimum user level to use the command
});

let CommandNewSchema = new Schema({
	streamerId: { type: String, required: true },
	chatName: { type: String, required: true }, // custom command name
	defaultName: String, // default command name, change to defaultName
	text: String, // only used for chat created commands || could be moved into output [default: text]
	cost: Number,
	createdBy: String,
	createdOn: Date,
	lastEditedBy: String,
	lastEditedOn: String,
	output: { type: Map, of: OutputSchema },
	versions: { type: Map, of: VersionSchema }, // "no arguement", "number argument", "string arguement"
});

CommandNewSchema.index({ streamerId: 1, chatName: 1 }, { unique: true });
CommandNewSchema.index({ chatName: 1, defaultName: 1 }, { unique: true });

module.exports = mongoose.model("CommandNew", CommandNewSchema);
