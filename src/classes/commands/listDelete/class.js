const BaseCommand = require("../baseCommand.js");

class ListDelete extends BaseCommand {
	constructor(channelId, name, { type, output, versions, commandGroup }) {
		super(channelId, name, { type, output, versions });
		this.commandGroup = commandGroup;
	}
}

module.exports = ListDelete;
