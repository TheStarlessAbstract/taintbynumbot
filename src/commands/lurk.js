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

	//// possible to move to nmove to function???
	let channel = command.getChannel([config.channelId]);
	if (!channel) {
		const userCommand = await CommandNew.findOne({
			streamerId: config.channelId,
			defaultName: "lurk",
		});
		if (!userCommand) return;

		channel = {
			output: userCommand.output,
			versions: userCommand.versions,
			// clearance/UserTypePermission/userTypeException: {broadcaster, mod, vip, artist}
			// cooldown: { length, lastUsed }
		};
		command.addChannel(config.channelId, channel);
	}
	////

	/// isUserTypeCleared()

	if (isBroadcaster(config)) return; // isCooldownPassed(currentTime, command.timer, cooldown);
	command.setTimer(currentTime); // setTimer for command.user[userId]

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
