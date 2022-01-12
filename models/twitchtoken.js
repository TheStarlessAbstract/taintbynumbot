let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let TwitchTokenSchema = new Schema({
	accessToken: String,
});

module.exports = mongoose.model("TwitchToken", TwitchTokenSchema);
