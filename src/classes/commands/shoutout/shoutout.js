const BaseCommand = require("../baseCommand.js");

class Shoutout extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}
}

module.exports = Shoutout;
