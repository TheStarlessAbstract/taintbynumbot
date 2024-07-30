const BaseCommand = require("../baseCommand");

class CounterDecrease extends BaseCommand {
	constructor(channelId, name, { type, output, versions, commandGroup }) {
		super(channelId, name, { type, output, versions });
		this.commandGroup = commandGroup;
	}
}

module.exports = CounterDecrease;
