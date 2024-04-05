const BotCommand = require("../classes/bot-command");
const {
	getChatCommandConfigMap,
	getProcessedOutputString,
} = require("../utils");

const cooldown = 0;

const commandResponse = async (config) => {
	const channel = await command.checkChannel(config, "lurk");
	if (!channel?.versions || !channel?.output) return;

	const isCommandAvailable = await command.checkCommandStatus(config, channel);
	if (!isCommandAvailable) return;

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
