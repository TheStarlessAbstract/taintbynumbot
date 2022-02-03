let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let TokenSchema = new Schema({
	name: String,
	accessToken: String,
	refreshToken: String,
	scope: [
		{
			type: String,
		},
	],
	expiresIn: Number,
	obtainmentTimestamp: Number,
});

module.exports = mongoose.model("Token", TokenSchema);
