let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let KingsSaveStateSchema = new Schema({
	deckId: Schema.Types.ObjectId,
	cardsToDraw: Schema.Types.Mixed,
	kingsCount: Number,
});

module.exports = mongoose.model("KingsSaveState", KingsSaveStateSchema);
