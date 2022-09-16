let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let LoyaltyPointSchema = new Schema({
	username: String,
	userId: {
		type: Number,
		unique: true,
	},
	points: Number,
	follower: Boolean,
});

module.exports = mongoose.model("LoyaltyPoint", LoyaltyPointSchema);
