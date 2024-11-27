const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const OutputSchema = new Schema({
	active: { type: Boolean, required: true },
	message: { type: String, required: true },
});

const AnnouncementSchema = new Schema({
	active: { type: Boolean, required: true },
	message: { type: String, required: true },
	colour: String,
});

const IntervalSchema = new Schema({
	active: { type: Boolean, required: true },
	duration: { type: Number, required: true },
});

const MessageInputSchema = new Schema({
	active: { type: Boolean, required: true },
	maxWordCount: { type: Number, required: true },
	minWordCount: { type: Number, required: true },
});

const RedemptionsSchema = new Schema({
	channelId: { type: String, required: true },
	channelName: { type: String, required: true },
	name: { type: String, required: true }, // rewardTitle
	type: { type: String, required: true }, // type of redemption
	output: { type: Map, of: OutputSchema },
	announcements: { type: Map, of: AnnouncementSchema },
	audio: [String],
	duration: Number, // autoLockAfter
	predictionOutcomes: [String], // outcomes - min 2, max 10
	predictionTitle: String, // title
	listCategory: String, // name of the List category - quote / title / tinder
	createdBy: String, // twitch user id, if mods can create?
	createdOn: Date,
	lastEditedBy: String, // twitch user id, if mods can edit?
	lastEditedOn: Date,
	interval: IntervalSchema,
	messageInput: MessageInputSchema,
});

RedemptionsSchema.index({ channelId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Redemption", RedemptionsSchema);
