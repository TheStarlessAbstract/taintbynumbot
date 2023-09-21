let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let KingsSaveStateSchema = new Schema({
	cardsToDraw: Schema.Types.Mixed,
	kingsCount: Number,
	jagerPrizeCounter: Number,
});

module.exports = mongoose.model("KingsSaveState", KingsSaveStateSchema);
