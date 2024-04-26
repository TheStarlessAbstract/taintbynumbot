const ChannelList = require("../classes/channelList.js");
const Channel = require("../classes/channel.js");
const twitchRepo = require("../../repos/twitch.js");
const { findOne } = require("../queries/commands");
const { findUserPoints } = require("../queries/loyaltyPoints");
const {
	isNonEmptyString,
	isValueNumber,
	getUserRolesAsStrings,
	getChatCommandConfigMap,
} = require("../utils/index.js");

const channels = new ChannelList(); // ["channelID": {name: "", messageCount: #,commands:{}}]

let chatClient;

function init() {
	chatClient = twitchRepo.getChatClient();
}

const handler = async (channelName, user, message, msg) => {
	if (hasUserInfoFormatChanged(msg.userInfo)) return;
	const channelId = msg.channelId;
	let channel = channels.getChannel(channelId);
	if (!channel) {
		channel = new Channel(channelId, channelName);
		channels.addChannel(channelId, channel);
	}
	channel.increaseMessageCount();

	if (!hasCommandPrefix(message)) return;
	let botUsername = "";
	if (isUserIgnoredForCommands(user, botUsername)) return;
	const commandAndArgument = getCommandNameAndArgument(message);
	const commandName = commandAndArgument.commandName.toLowerCase();
	const argument = commandAndArgument.argument;
	const messageDetails = getMessageDetails(
		msg,
		channelName,
		commandName,
		argument
	);

	let commandDetails = channel.getCommandDetails(commandName);
	if (!commandDetails) {
		commandDetails = await findOne(
			{ channelId: channelId, chatName: commandName },
			{ output: 1, versions: 1, text: 1, type: 1 }
		);
		if (!commandDetails) return false;
		commandDetails.reference = channel.getCommandReference(commandDetails.type);
		channel.addCommand(commandName, commandDetails);
	}

	const versionKey = commandDetails.reference.getCommandVersionKey(
		messageDetails,
		commandDetails.versions
	);
	if (!versionKey) return;
	const version = commandDetails.versions.get(versionKey);
	if (!version) return;

	const roleStrings = getUserRolesAsStrings(messageDetails);
	if (!roleStrings) return;
	const userPermission = hasUserPermission(roleStrings, version);
	if (!userPermission) return;

	const commandConfig = {
		channelId: channelId,
		userId: messageDetails.userId,
		username: user,
		chatName: commandName,
		hasCost: version.cost?.active,
		cost: version.cost?.points,
		hasAudioClip: version.hasAudioClip,
		hasLuck: version.luck?.active,
		odds: version.luck?.odds,
		versionKey: versionKey,
		output: commandDetails.output,
	};

	if (commandConfig.hasCost) {
		const { user, canPay, bypass } = await checkUserBalance(
			messageDetails,
			commandConfig.cost
		);
		if (!user) return;
		commandConfig.user = user;
		commandConfig.bypass = bypass;

		if (!canPay && commandConfig.hasLuck && !bypass) {
			commandConfig.diceRoll = diceRoll(commandConfig.odds);
		}
		if (canPay && !bypass) {
			user.points -= commandConfig.cost;
			user.save();
		}
		commandConfig.userCanPayCost = canPay;
	}

	commandConfig.configMap = getChatCommandConfigMap(messageDetails);
	const command = commandDetails.reference.getCommand();
	const result = await command(commandConfig);
	if (!result) return;

	if (typeof result === "string") chatClient.say(channelName, result);
	if (Array.isArray(result)) {
		for (let i = 0; i < result.length; i++) {
			chatClient.say(channelName, result[i]);
		}
	}
};

module.exports = { init, handler };

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
	const { usableBy, cooldown } = version;
	const userAllowed = hasPermittedRoles(roleStrings, usableBy);
	if (!userAllowed) return false;
	if (!cooldown || !cooldown?.length > 0) return true;

	const bypass = hasPermittedRoles(roleStrings, cooldown?.bypassRoles);
	if (bypass) return true;

	const cooldownPassed = isCooldownPassed(cooldown.lastUsed, cooldown.length);
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

	if (!user) return;
	if (channelId === userId) return { user, bypass: true };
	if (!user || user.points < cost) return { user, canPay: false };

	return { user, canPay: true };
}
