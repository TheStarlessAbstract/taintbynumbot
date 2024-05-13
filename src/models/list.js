const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const ListSchema = new Schema({
	channelId: { type: String, required: true },
	name: { type: String, required: true }, // quote/tinder - has to be the command name
	index: { type: Number, required: true },
	text: { type: String, required: true },
	createdBy: String,
	createdOn: Date,
	lastEditedBy: String,
	lastEditedOn: Date,
});

ListSchema.index({ channelId: 1, name: 1, index: 1 }, { unique: true });

module.exports = mongoose.model("List", ListSchema);
