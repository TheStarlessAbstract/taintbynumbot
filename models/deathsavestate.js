let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let DeathSaveStateSchema = new Schema({
	deaths: Number,
	gameDeaths: Number,
	allDeaths: Number,
	average: Number,
});

module.exports = mongoose.model("DeathSaveState", DeathSaveStateSchema);
