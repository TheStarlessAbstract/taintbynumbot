const BotCommand = require("../classes/bot-command");
const CommandNew = require("../../models/commandnew");
const {
	getChatCommandConfigMap,
	getProcessedOutputString,
	isCooldownPassed,
	configRoleStrings,
} = require("../utils");

const cooldown = 0;

const commandResponse = async (config) => {
	// /////
	let channel = await checkChannel(config, "lurk");
	if (!channel) return;

	let versionKey = getCommandVersionKey(config, channel);
	if (!versionKey) return;

	let commandRestriction = isCommandRestricted(
		config,
		channel.versions.get(versionKey)
	);
	if (commandRestriction) return;
	/////

	const chatCommandConfigMap = getChatCommandConfigMap(config);
	if (!(chatCommandConfigMap instanceof Map)) return;

	const output = getProcessedOutputString(
		channel,
		"isLurking",
		chatCommandConfigMap
	);

	if (typeof output !== "string") return;

	return output;
};

const command = new BotCommand(commandResponse, cooldown);

module.exports = command;

function isCommandRestricted(config, version) {
	const userAllowed = hasPermittedRoles(config, version.usableBy);
	if (!userAllowed) return true;

	const bypass = hasPermittedRoles(config, version.cooldown.bypassRoles);
	if (bypass) return false;

	return isCooldownPassed(
		currentTime,
		version.cooldown.lastUsed,
		version.cooldown.length
	);
}

function hasPermittedRoles(config, permittedRoles) {
	const roleStrings = configRoleStrings(config);
	const found = roleStrings.some((r) => permittedRoles.includes(r));

	return found;
}

async function checkChannel(config, type) {
	let channel = command.getChannel([config.channelId]);

	if (!channel) {
		const userCommand = await CommandNew.findOne({
			channelId: config.channelId,
			type: type,
		});
		if (!userCommand) return;

		channel = {
			output: userCommand.output,
			versions: userCommand.versions,
		};
		command.addChannel(config.channelId, channel);
	}

	return channel;
}

function getCommandVersionKey(config, channel) {
	let hasArgument = false;
	let argument = config.argument;
	if (argument) hasArgument = true;

	let isNumber = false;
	if (hasArgument) isNumber = isArgumentNumber();

	const iterator = channel.versions.entries();

	let pair;
	for (let i = 0; i < channel.versions.size; i++) {
		pair = iterator.next().value;
		if (
			!pair[1].active ||
			(!pair[1].isArgumentOptional && hasArgument != pair[1].hasArgument) ||
			isNumber != pair[1].isArgumentNumber
		)
			continue;

		return pair[0];
	}
	return;
}
