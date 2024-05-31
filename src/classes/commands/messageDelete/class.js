const BaseCommand = require("../baseCommand");

class MessageDelete extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}
}

module.exports = MessageDelete;
