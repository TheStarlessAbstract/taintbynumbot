const BaseCommand = require("../baseCommand.js");

class CommandDelete extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}
}

module.exports = CommandDelete;
