const BotCommand = require("../classes/bot-command");
const { play } = require("../services/audio");
const { getProcessedOutputString } = require("../utils");

const commandResponse = async (config) => {
	console.log("drink bitch");
	if (config.versionKey !== "noArgument") return;

	let outputType = "validBalance";
	if (!config.userCanPayCost && !config.diceRoll && !config.bypass) {
		outputType = "lowBalance";
	}
	if (!config.userCanPayCost && config.diceRoll && !config.bypass) {
		outputType = "luckyRoll";
	}

	const output = getProcessedOutputString(
		config.output.get(outputType),
		config.configMap
	);
	if (!output) return;

	if (
		config.hasAudioClip &&
		(outputType === "validBalance" || outputType === "luckyRoll")
	) {
		play({ channelId: config.channelId, chatName: config.chatName });
	}

	return output;
};

const command = new BotCommand(commandResponse);

module.exports = command;
