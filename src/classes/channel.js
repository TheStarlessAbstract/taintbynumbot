const { commandTypes } = require("../config");
const types = commandTypes();

class Channel {
	constructor(channelId, channelName) {
		this.id = channelId;
		this.name = channelName;
		this.messageCount = 0;
		this.isLive = false;
		this.lastIsLiveUpdate = false;
		this.timedMessagesInterval = 60000;
		this.commands = {}; // maybe a map instead
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;
	}

	getMessageCount() {
		return this.messageCount;
	}

	setMessageCount(count) {
		this.messageCount = count;
	}

	getIsLive() {
		return this.isLive;
	}

	setIsLive(isLive) {
		this.isLive = isLive;
	}

	getLastIsLiveUpdate() {
		return this.lastIsLiveUpdate;
	}

	setLastIsLiveUpdate(lastIsLiveUpdate) {
		this.lastIsLiveUpdate = lastIsLiveUpdate;
	}

	getTimedMessagesInterval() {
		return this.timedMessagesInterval;
	}

	setTimedMessagesInterval(timedMessagesInterval) {
		this.timedMessagesInterval = timedMessagesInterval;
	}

	increaseMessageCount() {
		this.messageCount++;
	}

	decreaseMessageCount() {
		this.messageCount--;
	}

	getCommandDetails(name) {
		if (!this.commands.hasOwnProperty(name)) return false;
		return this.commands[name];
	}

	addCommand(name, commandDetails) {
		this.commands[name] = commandDetails;
	}

	getCommandReference(type) {
		return types[type];
	}
}

module.exports = Channel;
