const { commandTypes } = require("../config");

class Channel {
	constructor(channelId, channelName) {
		this.id = channelId;
		this.name = channelName;
		this.messageCount = 0;
		this.commands = {};
	}

	getMessageCount() {
		return this.messageCount;
	}

	setMessageCount(count) {
		this.messageCount = count;
	}

	increaseMessageCount() {
		this.messageCount++;
	}

	decreaseMessageCount() {
		this.messageCount--;
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;
	}

	async getCommandDetails(name) {
		if (!this.commands.hasOwnPropery(name)) return false;
		return this.commands[name];
	}

	addCommand(name, type, commandDetails) {
		const { output, versions } = commandDetails;
		const command = commandTypes[type];

		this.commands[name] = { command, output, versions };
	}
}

module.exports = Channel;
