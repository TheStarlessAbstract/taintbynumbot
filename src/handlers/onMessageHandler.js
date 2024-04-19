const ChannelList = require("../classes/channelList.js");
const Channel = require("../classes/channel.js");
const { findOne } = require("../queries/commands");
const { findUserPoints } = require("../queries/loyaltyPoints");
const {
	isNonEmptyString,
	isValueNumber,
	getUserRolesAsStrings,
	getChatCommandConfigMap,
} = require("../utils/index.js");

// chatClient.onMessage(async (channelName, user, message, msg) => {
// 	await onMessageHandler(channelName, user, message, msg);
// });
// chatClient.onMessage(onMessageHandler);

const channels = new ChannelList(); // ["channelID": {name: "", messageCount: #,commands:{}}]

const onMessageHandler = async (channelName, user, message, msg) => {
	if (hasUserInfoFormatChanged(msg.userInfo)) return; // checks to see if propery types have changed, or expected properties are missing
	const channelId = msg.channelId;
	let channel = channels.getChannel(channelId); // function that retrives channel by id, from channels Map/array/thing
	if (!channel) {
		//query DB for channel
		channel = new Channel(channelId, channel);
		channels.addChannel(channelId, channel); // function to add channel to channels Map/array/thing
	}
	channel.increaseMessageCount();
	// is this channel the same instance as the one in channels, does it need to be updated there

	if (!hasCommandPrefix(message)) return; // checks message prefix to validate command format
	let botUsername = "";
	if (isUserIgnoredForCommands(user, botUsername)) return; // certain users/bots to ignore commands from
	const { commandName, argument } = getCommandNameAndArgument(message);
	const messageDetails = getMessageDetails(
		msg,
		channelName,
		commandName,
		argument
	);

	// function will check instance for commandname and return if found, otherwis wil query DB
	let commandDetails = channel.getCommandDetails(commandName); // {reference, output, versions, text, type}
	if (!commandDetails) {
		commandDetails = await findOne(
			{ channelId: channelId, chatName: commandName },
			{ output: 1, versions: 1, text: 1, type: 1 }
		);
		if (!commandDetails) return false;
		commandDetails.reference = channel.addCommand(commandName, commandDetails); /// unsure what here
	}
	const reference = commandDetails.reference;
	// determine input type
	const versionKey = reference.getCommandVersionKey(
		messageDetails,
		commandDetails.versions
	);
	if (!versionKey) return;

	// match input type to available versions -> commandDetails.versions
	const version = commandDetails.versions.get(versionKey);
	// check if command version has a cost
	const cost = version?.cost;
	const hasAudioClip = version.hasAudioClip;
	const roleStrings = getUserRolesAsStrings(messageDetails);
	if (!roleStrings) return;

	const userPermission = hasUserPermission(roleStrings, version);
	if (!userPermission) return;

	if (cost) {
		// check if user can pay
		const { user, canPay } = await checkUserBalance(config, cost);
		let diceRoll = false;
		if (!canPay) {
			//roll dice
		}
		if (!diceRoll && !canPay) return;
		if (canPay) {
			user.points -= cost;
			user.save();
		}
	}

	const configMap = getChatCommandConfigMap(messageDetails);
	const output = commandDetails.output;
	const command = reference.getCommand();
	const result = await command({ versionKey, configMap, output, hasAudioClip });

	return result;
};

module.exports = onMessageHandler;

function hasCommandPrefix(message) {
	return message.startsWith("!"); // Maybe give option to use another character for command prefix, then need to get based on channel message is in
}

function isUserIgnoredForCommands(user, botUsername) {
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
	const [commandName, argument] = message.slice(1).split(/\s(.+)/);
	return { commandName, argument };
}

function getMessageDetails(msg, channel, command, argument) {
	const details = msg.userInfo;
	details.channelId = msg.channelId;
	details.channelName = channel;
	details.chatName = command;
	details.argument = argument;

	return details;
}

function hasPermittedRoles(roleStrings, permittedRoles) {
	if (!permittedRoles) return false;
	return roleStrings.some((role) => permittedRoles.includes(role));
}

function isCooldownPassed(lastUsed, cooldownLength) {
	if (!(lastUsed instanceof Date) || !isValueNumber(cooldownLength))
		return false;
	if (cooldownLength <= 0) return true;

	const currentTime = Date.now();
	if (lastUsed > currentTime) return false;

	const timeDifference = currentTime - lastUsed;
	return timeDifference >= cooldownLength;
}

function hasUserPermission(roleStrings, version) {
	const userAllowed = hasPermittedRoles(roleStrings, version.usableBy);
	if (!userAllowed) return false;

	if (!version?.cooldown) return true;

	const bypass = hasPermittedRoles(roleStrings, version.cooldown?.bypassRoles);
	if (bypass) return true;

	const cooldownPassed = isCooldownPassed(
		version.cooldown.lastUsed,
		version.cooldown.length
	);

	return cooldownPassed;
}

async function checkUserBalance({ channelId, userId }, cost) {
	if (
		!isNonEmptyString(channelId) ||
		!isNonEmptyString(userId) ||
		!isValueNumber(cost)
	)
		return;

	const user = await findUserPoints({
		channelId: channelId,
		viewerId: userId,
	});

	if (!user || user.points < cost) return { user: {}, canPay: false };

	return { user, canPay: true };
}
