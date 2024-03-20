let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let MessageSchema = new Schema({
	index: { type: Number },
	twitchId: { type: String },
	text: {
		type: String,
	},
	addedBy: String,
});

MessageSchema.index({ twitchId: 1, index: 1 }, { unique: true });
MessageSchema.index({ twitchId: 1, text: 1 }, { unique: true });

module.exports = mongoose.model("Message", MessageSchema);

// ORIGINAL
// let mongoose = require("mongoose"),
// 	Schema = mongoose.Schema;

// let MessageSchema = new Schema({
// 	index: { type: Number, unique: true },
// 	text: {
// 		type: String,
// 		unique: true,
// 	},
// 	addedBy: String,
// });

// module.exports = mongoose.model("Message", MessageSchema);
