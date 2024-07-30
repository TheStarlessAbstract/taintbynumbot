const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const CooldownSchema = new Schema({
	length: { type: Number, required: true },
	lastUsed: Date,
	bypassRoles: [String],
});

const OutputSchema = new Schema({
	message: String,
	active: { type: Boolean, required: true },
});

const LuckSchema = new Schema({
	active: Boolean,
	odds: Number,
});

const CostSchema = new Schema({
	active: Boolean,
	points: Number,
	bypassRoles: [String],
});

const VersionSchema = new Schema({
	isArgumentOptional: { type: Boolean, required: true },
	hasArgument: Boolean,
	isArgumentNumber: Boolean,
	description: { type: String, required: true }, // what is the purpose of this version of the command
	active: { type: Boolean, required: true }, // can this command be used in chat
	usableBy: [String],
	cooldown: { type: CooldownSchema },
	cost: { type: CostSchema },
	hasAudioClip: Boolean,
	luck: { type: LuckSchema },
});

const CommandNewSchema = new Schema({
	channelId: { type: String, required: true },
	chatName: { type: String, required: true }, // custom command name !addquote
	type: String, // type of command
	createdBy: String,
	createdOn: Date,
	lastEditedBy: String,
	lastEditedOn: String,
	commandGroup: String, // is the same as the chatName of the main command eg. quote - main command / quoteadd sub command
	output: { type: Map, of: OutputSchema }, // not requried as text only commands don't have output or versions fields
	versions: { type: Map, of: VersionSchema }, // "no argument", "numberArgument", "stringArgument"
});

CommandNewSchema.index({ channelId: 1, chatName: 1 }, { unique: true });

module.exports = mongoose.model("CommandNew", CommandNewSchema);
