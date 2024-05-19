const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const TokenSchema = new Schema({
	tokenType: { type: String, required: true }, // twitch, spotify
	accessToken: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	},
	scope: [
		{
			type: String,
			required: true,
		},
	],
	expiresIn: {
		type: Number,
		required: true,
	},
	obtainmentTimestamp: {
		type: Number,
		required: true,
	},
});

const UserNewSchema = new Schema({
	channelId: { type: String, unique: true, required: true },
	displayName: { type: String, unique: true, required: true },
	role: { type: String, required: true, enum: ["admin", "bot", "user"] },
	joinDate: {
		type: Date,
		required: true,
	},
	tokens: { type: Map, of: TokenSchema },
});

module.exports = mongoose.model("UserNew", UserNewSchema);
