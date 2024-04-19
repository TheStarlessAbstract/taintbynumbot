let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let LoyaltyPointNewSchema = new Schema({
	channelId: String,
	viewerId: String,
	points: Number,
	follower: Boolean,
});

LoyaltyPointNewSchema.index({ twitchId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("LoyaltyPointNew", LoyaltyPointNewSchema);
