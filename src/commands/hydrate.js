const BaseCommand = require("../../classes/base-command");
const { play } = require("../services/audio");
const {
	diceRoll,
	getChatCommandConfigMap,
	getProcessedOutputString,
} = require("../utils");

const commandResponse = async (config) => {
	const commandDetails = commandType.checkCommandCanRun(config);
	if (!commandDetails) return;

	const chatCommandConfigMap = getChatCommandConfigMap(config);
	if (!chatCommandConfigMap) return;

	if (commandDetails.version !== "noArgument") return;

	let outputType = "validBalance";

	if (!commandDetails.userCanPayCost && !diceRoll(commandDetails.luck.odds)) {
		outputType = "lowBalance";
	}

	if (!commandDetails.userCanPayCost) {
		outputType = "luckyRoll";
	}

	if (commandDetails.userCanPayCost) {
		commandDetails.user.points -= commandDetails.cost;
		await commandDetails.user.save();
	}

	if (
		commandDetails.hasAudioClip &&
		(outputType === "validBalance" || outputType === "luckyRoll")
	) {
		play({ channelId: config.channelId, chatName: config.chatName });
	}

	const output = getProcessedOutputString(
		commandDetails.output.get(outputType),
		chatCommandConfigMap
	);
	if (!output) return;

	return output;
};

const command = new BaseCommand(commandResponse);

module.exports = command;
