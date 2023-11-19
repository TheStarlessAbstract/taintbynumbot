let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let TwitchTokenSchema = new Schema({
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

let SpotifyTokenSchema = new Schema({
	accessToken: { type: String, require: true },
	tokenType: { type: String, require: true, enum: ["Bearer"] },
	scope: [
		{
			type: String,
			require: true,
		},
	],
	expiresIn: {
		type: Date,
		required: true,
	},
	refreshToken: { type: String, require: true },
});

let UserSchema = new Schema({
	twitchId: { type: String, unique: true, require: true },
	joinDate: {
		type: Date,
		require: false,
	},
	twitchToken: {
		type: TwitchTokenSchema,
		require: false,
	},
	spotifyToken: {
		type: SpotifyTokenSchema,
		require: false,
	},
	role: { type: String, require: true, enum: ["admin", "bot", "user"] },
});

module.exports = mongoose.model("User", UserSchema);
