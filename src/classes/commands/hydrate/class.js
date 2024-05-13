const BaseCommand = require("../baseCommand");

class Hydrate extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	versionHasAudioClip(key) {
		return this.versions.get(key).hasAudioClip;
	}
}

module.exports = Hydrate;
