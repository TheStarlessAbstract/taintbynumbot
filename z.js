const BaseCommand = require("./src/classes/base-command");

class Game extends BaseCommand {
	constructor(command) {
		super(command);
		this.name = "";
		this.type = "game";
	}

	filterItemsByName(array, input) {
		const sanitizedInput = input
			.toLowerCase()
			.trim()
			.replace(/[^a-zA-Z0-9\s]/g, "");
		const inputParts = sanitizedInput
			.split(/\s+/)
			.filter((part) => part.trim() !== "");

		// Attempt direct matching first
		const directMatches = array.filter((item) =>
			startsWithSanitizedInput(item.name, sanitizedInput)
		);

		if (directMatches.length > 0) {
			return directMatches; // Return direct matches if found
		} else {
			// If no direct matches, use substring matching
			return array.filter((item) => matchesItemName(item.name, inputParts));
		}
	}
}
module.exports = Game;
