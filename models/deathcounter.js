let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let DeathCounterSchema = new Schema({
	deaths: Number,
	gameTitle: String,
	streamStartDate: Date,
});

module.exports = mongoose.model("DeathCoutner", DeathCounterSchema);
