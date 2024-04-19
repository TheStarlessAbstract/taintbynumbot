const ChannelList = require("../classes/channelList.js");
const Channel = require("../classes/channel.js");
const { findOne } = require("../queries/commands");

chatClient.onMessage(async (channelName, user, message, msg) => {
	await onMessageHandler(channelName, user, message, msg);
});
chatClient.onMessage(onMessageHandler);

const channels = new ChannelList(); // ["channelID": {commands:{}}]

const onMessageHandler = async (channelName, user, message, msg) => {
	if (hasUserInfoFormatChanged(msg.userInfo)) return; // checks to see if propery types have changed, or expected properties are missing
	const channelId = messageDetails.channelId;
	let channel = channels.getChannel(channelId); // function that retrives channel by id, from channels Map/array/thing
	if (!channel) {
		//query DB for channel
		channel = new Channel(channelId, channel);
		channels.addChannel(channelId, channel); // function to add channel to channels Map/array/thing
	}
	channel.incrementMessageCount();
	// is this channel the same instance as the one in channels, does it need to be updated there

	if (!hasCommandPrefix(message)) return; // checks message prefix to validate command format
	if (!isUserAllowedToUseCommands(user, botUsername, message)) return; // certain users/bots to ignore commands from
	const { commandName, argument } = getCommandNameAndArgument(message);
	const messageDetails = getMessageDetails(
		msg,
		channelName,
		commandName,
		argument
	);

	// function will check instance for commandname and return if found, otherwis wil query DB
	let commandDetails = channel.getCommandDetails(commandName); // {output, versions, text, type}
	if (!commandDetails) {
		commandDetails = findOne(
			{ channelId: channelId, chatName: commandName },
			{ output: 1, versions: 1, text: 1, type: 1 }
		);
		if (!commandDetails) return false;

		channel.addCommand(commandName, type, commandDetails); /// unsure what here
	}

	// determine input type
	// match input type to available versions   -> commandDetails.versions
	// check if command version has a cost
	// check if user can pay
	const result = await response(messageDetails);
	// if result, and user had to pay, deduct cost
	// display output
};

module.exports = onMessageHandler;

function hasCommandPrefix(message) {
	return message.startsWith("!"); // Maybe give option to use another character for command prefix, then need to get based on channel message is in
}

function isUserAllowedToUseCommands(user, botUsername, message) {
	return user === botUsername || user === "buhhsbot";
}

function hasUserInfoFormatChanged(userInfo) {
	const stringTypes = [
		userInfo.color,
		userInfo.displayName,
		userInfo.userId,
		userInfo.userName,
		userInfo.userType,
	];

	const stringUndefinedTypes = [userInfo.color, userInfo.userType];

	const boolTypes = [
		userInfo.isArtist,
		userInfo.isBroadcaster,
		userInfo.isFounder,
		userInfo.isMod,
		userInfo.isSubscriber,
		userInfo.isVip,
	];
	const mappedTypes = [userInfo.badgeInfo, userInfo.badges];

	issuesRaised = false;

	stringTypes.forEach(confirmStrings);

	if (!issuesRaised) {
		stringUndefinedTypes.forEach(confirmStringsOrUndefined);
	}

	if (!issuesRaised) {
		boolTypes.forEach(confirmBools);
	}

	if (!issuesRaised) {
		mappedTypes.forEach(confirmMaps);
	}

	return issuesRaised;
}

function confirmStrings(item) {
	if (!issuesRaised) {
		issuesRaised = typeof item != "string";
	}
}

function confirmStringsOrUndefined(item) {
	if (!issuesRaised) {
		issuesRaised = typeof item != "string" || item == undefined;
	}
}

function confirmBools(item) {
	if (!issuesRaised) {
		issuesRaised = typeof item != "boolean";
	}
}

function confirmMaps(item) {
	if (!issuesRaised) {
		issuesRaised = !(item instanceof Map);
	}
}

function getCommandNameAndArgument(message) {
	const [command, argument] = message.slice(1).split(/\s(.+)/);
	return { command, argument };
}

function getMessageDetails(msg, channel, command, argument) {
	const details = msg.userInfo;
	details.channelId = msg.channelId;
	details.channelName = channel;
	details.chatName = command;
	details.argument = argument;

	return details;
}
