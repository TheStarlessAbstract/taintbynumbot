let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let MessageListSchema = new Schema({
	twitchId: { type: String },
	index: { type: Number },
	text: {
		type: String,
	},
	addedBy: String,
});

MessageListSchema.index({ twitchId: 1, index: 1 }, { unique: true });
MessageListSchema.index({ twitchId: 1, text: 1 }, { unique: true });

module.exports = mongoose.model("MessageList", MessageListSchema);
