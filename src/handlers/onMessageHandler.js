const Channel = require("../classes/channel");
const twitchRepo = require("../repos/twitch");
const commands = require("../queries/commands");
const points = require("../queries/loyaltyPoints");
const { isValueNumber, isNonEmptyString } = require("../utils/valueChecks");
const { getCommandType } = require("../utils/messageHandler");
const { firstLetterToUpperCase, splitArgs } = require("../utils/modify");
const { getUserRolesAsStrings, getChatCommandConfigMap } = require("../utils");
const { getChannelInfoById } = require("../services/twitch/channels");
const channelsService = require("../services/channels/channels");

const handler = async (channelName, userName, message, msg) => {
	if (hasUserInfoFormatChanged(msg.userInfo)) return;
	const channelId = msg.channelId;

	let channel = channelsService.getChannel(channelId);
	// if (!channel) {
	// 	const twitchChannel = await getChannelInfoById(channelId);
	// 	channel = new Channel(channelId, twitchChannel.displayName);
	// 	channelsService.addChannel(channelId, channel);
	// }
	channel.increaseMessageCount();

	if (!hasCommandPrefix(message)) return;
	let botUsername = "";
	if (isUserIgnoredForCommands(userName, botUsername)) return;
	let { first: commandName, second: argument } = splitArgs(message, 1);
	commandName = commandName.toLowerCase();
	const messageDetails = getMessageDetails(
		msg,
		channel.name,
		commandName,
		argument
	);

	let commandA = channel.getCommand(commandName);
	if (!commandA) {
		let commandDetails = await commands.findOne(
			{ channelId: channelId, chatName: commandName },
			{ type: 1, output: 1, versions: 1, commandGroup: 1 }
		);
		if (!commandDetails) return false;
		const CommandType = getCommandType(commandDetails.type);
		commandA = new CommandType(channelId, commandName, commandDetails);
		channel.addCommand(commandName, commandA);
	}
	const { versionKey, version } = commandA.getCommandVersion(messageDetails);
	if (!versionKey) return;

	const roleStrings = getUserRolesAsStrings(messageDetails);
	if (!roleStrings) return;

	const userPermission = hasUserPermission(
		roleStrings,
		version.usableBy,
		version.cooldown
	);
	if (!userPermission) return;

	const commandConfig = {
		channelId: channelId,
		userId: messageDetails.userId,
		username: messageDetails.displayName,
		chatName: commandName,
		chatNameFirstLetterUppercase: messageDetails.chatNameFirstLetterUppercase,
		versionKey: versionKey,
		argument: argument,
		permitted: userPermission,
	};

	if (version?.cost) {
		const { user, canPay, bypass } = await checkUserBalance(
			messageDetails.channelId,
			messageDetails.userId,
			version?.cost.points
		);
		if (!user) return;

		if (!canPay && version?.luck?.active && !bypass) {
			commandConfig.diceRoll = diceRoll(version.luck?.odds);
		}
		if (canPay && !bypass) {
			user.points -= version.cost?.points;
			user.save();
		}
		commandConfig.user = user;
		commandConfig.bypass = bypass;
		commandConfig.userCanPayCost = canPay;
	}

	commandConfig.configMap = getChatCommandConfigMap(messageDetails);
	const action = commandA.getVersionAction(versionKey);
	const result = await action(commandConfig);
	if (!result) return;
	const chatClient = twitchRepo.getChatClient();

	if (typeof result === "string") chatClient.say(channelName, result);
	if (Array.isArray(result)) {
		for (let i = 0; i < result.length; i++) {
			chatClient.say(channelName, result[i]);
		}
	}
};

module.exports = { handler };

function hasCommandPrefix(message) {
	return message.startsWith("!") && message.length > 1; // Maybe give option to use another character for command prefix, then need to get based on channel message is in
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

function getMessageDetails(msg, channel, command, argument) {
	const details = {
		channelId: msg.channelId,
		channelName: channel,
		chatName: command,
		argument: argument,
		chatNameFirstLetterUppercase: firstLetterToUpperCase(command),
		badgeInfo: msg.userInfo.badgeInfo,
		badges: msg.userInfo.badges,
		color: msg.userInfo.color,
		displayName: msg.userInfo.displayName,
		isArtist: msg.userInfo.isArtist,
		isBroadcaster: msg.userInfo.isBroadcaster,
		isFounder: msg.userInfo.isFounder,
		isMod: msg.userInfo.isMod,
		isSubscriber: msg.userInfo.isSubscriber,
		isVip: msg.userInfo.isVip,
		userId: msg.userInfo.userId,
		userName: msg.userInfo.userName,
		userType: msg.userInfo.userType,
	};

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

function hasUserPermission(roleStrings, usableBy, cooldown) {
	const userAllowed = hasPermittedRoles(roleStrings, usableBy);
	if (!userAllowed) return false;
	if (!cooldown || !cooldown?.length > 0) return true;

	const bypass = hasPermittedRoles(roleStrings, cooldown?.bypassRoles);
	if (bypass) return true;

	const cooldownPassed = isCooldownPassed(cooldown.lastUsed, cooldown.length);
	return cooldownPassed;
}

async function checkUserBalance(channelId, userId, cost) {
	if (
		!isNonEmptyString(channelId) ||
		!isNonEmptyString(userId) ||
		!isValueNumber(cost)
	)
		return;

	const user = await points.findOne({
		channelId: channelId,
		viewerId: userId,
	});

	if (!user) return;
	if (channelId === userId) return { user, canPay: true, bypass: true };
	if (!user || user.points < cost)
		return { user: null, canPay: false, bypass: false };

	return { user, canPay: true, bypass: false };
}
