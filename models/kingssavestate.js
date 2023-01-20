let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let KingsSaveStateSchema = new Schema({
	cardsToDraw: Schema.Types.Mixed,
	kingsCount: Number,
});

module.exports = mongoose.model("KingsSaveState", KingsSaveStateSchema);
