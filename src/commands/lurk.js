const BotCommand = require("../classes/bot-command");
const CommandNew = require("../../models/commandnew");
const {
	getChatCommandConfigMap,
	getProcessedOutputString,
	isBroadcaster,
	isCooldownPassed,
} = require("../utils");

const cooldown = 0;

const commandResponse = async (config) => {
	let currentTime = new Date();

	// flow
	// check command.users to see if command details available,
	let channel = command.getChannel([config.channelId]);

	// otherwise go to db, retrieve, add to command.users, continue
	// if nothing in db, then return out
	if (!channel) {
		const userCommand = await CommandNew.findOne({
			channelId: config.channelId,
			type: "lurk",
		});
		if (!userCommand) return;

		channel = {
			output: userCommand.output,
			versions: userCommand.versions,
		};
		command.addChannel(config.channelId, channel);
	}

	// decide version of command being called, if active, continue
	isVersionActive();
	// check if cooldown passed, update cooldown lastUsed if needed isCooldownpassed()
	isCooldownPassed(currentTime, command.timer, cooldown);
	// check if usable by user  isUserTypeCleared()
	if (isBroadcaster(config)) return;

	// continue into chatConfigMap

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
