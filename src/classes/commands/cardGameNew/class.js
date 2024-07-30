const BaseCommand = require("../baseCommand.js");
const { findOne } = require("../../../queries/audioLinks");

class CardGame extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
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
