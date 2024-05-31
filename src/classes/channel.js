const { getRandomBetweenInclusiveMax } = require("../utils");
const { say } = require("../services/twitch/chatClient");
const { commandTypes } = require("../config");
const types = commandTypes();

class Channel {
	constructor(
		channelId,
		channelName,
		messages,
		messageCountTrigger,
		messageIntervalLength
	) {
		this.id = channelId;
		this.name = channelName;
		this.isLive = false;
		this.lastIsLiveUpdate = false;
		this.messages = messages; // array
		this.messageCount = 0;
		this.messageCountTrigger = messageCountTrigger;
		this.messageIntervalLength = messageIntervalLength; // in minutes
		this.messsageInterval = this.startMessageInterval();

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

	// bot messages sent to chat after interval
	startMessageInterval() {
		let messageToggleCheck = false;

		return setInterval(async () => {
			// if count greater than trigger tries to send a message
			if (this.messageCount >= this.messageCountTrigger) {
				// filters messages for all messages matching toggle
				const filteredMessages = this.messages.filter(
					(message) => message.sentToggle === messageToggleCheck
				);

				// gets a random message
				const message =
					filteredMessages[
						getRandomBetweenInclusiveMax(0, filteredMessages.length)
					];

				this.messageCount = 0;

				// flips toggle when all messages used
				if (filteredMessages.length <= 1)
					messageToggleCheck = !messageToggleCheck;
				if (!message) return;

				message.sentToggle = !messageToggleCheck;

				// sends message to Twitch chat
				say(this.name, `${message.index}. ${message.text}`);
			}
		}, this.messageIntervalLength * 60 * 1000);
	}

	stopMessageInterval() {
		clearInterval(this.messsageInterval);
	}

	checkMessageExists(messageQuery) {
		messageQuery = messageQuery.toLowerCase();
		return this.messages.some(
			(message) => messageQuery === message.text.toLowerCase()
		);
	}

	// add new message to messages
	addMessage(text, addedBy) {
		const message = {
			index: 1,
			text,
			addedBy,
		};

		if (this.messages.length >= 1) {
			// gets current highest index in messages
			const index = this.messages.reduce((a, b) =>
				a.index > b?.index ? a : b
			).index;
			message.index = index + 1;
		}

		this.messages.push(message);
		return message;
	}
}

module.exports = Channel;
