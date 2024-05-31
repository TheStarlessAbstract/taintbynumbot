const BaseCommand = require("../baseCommand");

class MessageAdd extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}
}

module.exports = MessageAdd;
