const BaseCommand = require("../classes/base-command");
const { play } = require("../services/audio");
const { getProcessedOutputString } = require("../utils");

/**
 * Generates a command response based on the provided configuration.
 * @param {Object} config - The configuration object.
 * @param {string} config.versionKey - The version key used to determine the output type.
 * @param {boolean} config.userCanPayCost - Indicates whether the user can pay a cost.
 * @param {boolean} config.diceRoll - Indicates whether a dice roll is involved.
 * @param {boolean} config.bypass - Indicates whether the normal flow should be bypassed.
 * @param {Object} config.output - An object mapping output types to corresponding output strings.
 * @param {Map} config.configMap - A configuration map used by the `getProcessedOutputString` function.
 * @param {boolean} config.hasAudioClip - Indicates whether an audio clip should be played.
 * @param {string} config.channelId - The ID of the channel where the audio clip should be played.
 * @param {string} config.chatName - The name of the chat.
 * @returns {string|undefined} - The generated output string.
 */
const commandResponse = async (config) => {
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

const command = new BaseCommand(commandResponse);

module.exports = command;
