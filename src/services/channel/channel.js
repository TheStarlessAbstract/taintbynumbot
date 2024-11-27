const Channel = require("../../classes/channel");

function createChannel(
	channelId,
	displayName,
	dbMessages,
	messageCountTrigger,
	messageIntervalLength,
	customBot
) {
	const messages = [];

	for (let i = 0; i < dbMessages.length; i++) {
		messages.push({
			index: dbMessages[i].index,
			text: dbMessages[i].text,
			addedBy: dbMessages[i].addedBy,
			sentToggle: false,
		});
	}

	return new Channel(
		channelId,
		displayName,
		messages,
		messageCountTrigger,
		messageIntervalLength,
		customBot
	);
}

module.exports = {
	createChannel,
};
