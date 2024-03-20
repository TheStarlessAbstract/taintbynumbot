let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let LoyaltyPointTempSchema = new Schema({
	twitchId: String,
	userId: String,
	points: Number,
	follower: Boolean,
});

LoyaltyPointTempSchema.index({ twitchId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("LoyaltyPointTemp", LoyaltyPointTempSchema);
