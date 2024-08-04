const BaseCommand = require("../baseCommand.js");
const { findOne } = require("../../../queries/audioLinks");

class CardGame extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	validateCard(drawn) {
		if (
			typeof drawn !== "object" &&
			(!drawn?.card || !drawn?.reset || !drawn?.bonus)
		)
			false;
		const { card, reset, bonus } = drawn;
		if (
			!card?.suit ||
			!card?.value ||
			!card?.rule ||
			!card?.explanation ||
			typeof reset !== "boolean" ||
			!Array.isArray(bonus)
		)
			return false;

		return true;
	}

	async getAudioUrl(name) {
		if (!name) return;

		const audioLink = await findOne({
			channelId: this.channelId,
			name: name,
		});
		if (!audioLink) return;

		return audioLink.url;
	}
}

module.exports = CardGame;
