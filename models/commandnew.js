let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let CooldownSchema = new Schema({
	length: { type: Number, required: true },
	lastUsed: Number,
	bypassRoles: [String],
});

let OutputSchema = new Schema({
	message: { type: String, required: true },
	active: { type: Boolean, required: true },
});

let VersionSchema = new Schema({
	isArgumentOptional: { type: Boolean, required: true },
	hasArgument: Boolean,
	isArgumentNumber: Boolean,
	description: { type: String, required: true }, // what is the purpose of this version of the command
	active: { type: Boolean, required: true }, // can this command be used in chat
	usableBy: [String],
	cooldown: { type: CooldownSchema },
	cost: Number,
	hasAudioClip: Boolean,
});

let CommandNewSchema = new Schema({
	channelId: { type: String, required: true },
	chatName: { type: String, required: true }, // custom command name
	type: String, // type of command
	text: String, // only used for chat created commands || could be moved into output [default: text]
	createdBy: String,
	createdOn: Date,
	lastEditedBy: String,
	lastEditedOn: String,
	output: { type: Map, of: OutputSchema },
	versions: { type: Map, of: VersionSchema }, // "no argument", "numberArgument", "stringArgument"
});

CommandNewSchema.index({ channelId: 1, chatName: 1 }, { unique: true });

module.exports = mongoose.model("CommandNew", CommandNewSchema);
