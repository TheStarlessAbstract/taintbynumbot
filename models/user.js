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
	access_token: { type: String, require: true },
	token_type: { type: String, require: true, enum: ["Bearer"] },
	scope: [
		{
			type: String,
			require: true,
		},
	],
	expires_in: {
		type: Date,
		required: true,
	},
	refresh_token: { type: String, require: true },
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
});

module.exports = mongoose.model("User", UserSchema);
