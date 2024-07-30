const { getRandomBetweenInclusiveMax } = require("../utils");
const { say } = require("../services/twitch/chatClient");
const { commandTypes } = require("../config");
const types = commandTypes();
const Text = require("./commands/text/class");

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
		this.cardGames = {}; // name propery == commandname
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

	addCommand(name, command) {
		this.commands[name] = command;
	}

	addTextCommand(name, type, output, versions) {
		const command = new Text(this.id, name, { type, output, versions });
		this.commands[name] = command;
	}

	editTextCommand(name, textUpdate) {
		const textOutput = this.commands[name]?.output.get("text");
		if (textOutput) textOutput.message = textUpdate;
	}

	deleteCommand(name) {
		delete this.commands[name];
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
		return this.messages.find(
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

	getMessageByIndex(index) {
		return this.messages.find((message) => message.index === index);
	}

	deleteMessageByIndex(index) {
		const messageIndex = this.messages.findIndex(
			(message) => message.index === index
		);

		this.messages.splice(messageIndex, 1);
	}

	addCardGame(name, game) {
		this.cardGames[name] = game;
	}

	getCardGame(name) {
		return this.cardGames[name];
	}
}

module.exports = Channel;
