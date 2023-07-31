let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let TokenSchema = new Schema({
	twitchId: {
		type: String,
	},
	name: {
		type: String,
		required: true,
	},
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

module.exports = mongoose.model("Token", TokenSchema);
