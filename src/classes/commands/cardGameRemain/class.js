const BaseCommand = require("../baseCommand.js");

class CardGameRemain extends BaseCommand {
	constructor(channelId, name, { type, output, versions, commandGroup }) {
		super(channelId, name, { type, output, versions });
		this.commandGroup = commandGroup;
	}
}

module.exports = CardGameRemain;
