let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let LoyaltyPointSchema = new Schema({
	twitchId: String,
	userId: String,
	points: Number,
	follower: Boolean,
});

LoyaltyPointSchema.index({ twitchId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("LoyaltyPoint", LoyaltyPointSchema);
