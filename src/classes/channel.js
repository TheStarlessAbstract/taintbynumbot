const { commandTypes } = require("../config");
const types = commandTypes();

class Channel {
	constructor(channelId, channelName) {
		this.id = channelId;
		this.name = channelName;
		this.isLive = false;
		this.lastIsLiveUpdate = false;
		this.messageCount = 0;
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

	increaseMessageCount() {
		this.messageCount++;
	}

	decreaseMessageCount() {
		this.messageCount--;
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

	getCommandDetails(name) {
		if (!this.commands.hasOwnProperty(name)) return false;
		return this.commands[name];
	}

	addCommand(name, commandDetails) {
		this.commands[name] = commandDetails;
	}

	getCommand(name) {
		return this.commands[name];
	}

	getCommandReference(type) {
		return types[type];
	}
}

module.exports = Channel;
