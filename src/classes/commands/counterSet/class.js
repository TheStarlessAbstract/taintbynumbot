const BaseCommand = require("../baseCommand");

class CounterSet extends BaseCommand {
	constructor(channelId, name, { type, output, versions, commandGroup }) {
		super(channelId, name, { type, output, versions });
		this.commandGroup = commandGroup;
	}
}

module.exports = CounterSet;
