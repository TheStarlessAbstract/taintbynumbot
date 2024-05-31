const BaseCommand = require("../baseCommand");

class MessageEdit extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}
}

module.exports = MessageEdit;
