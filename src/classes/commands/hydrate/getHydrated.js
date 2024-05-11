const { play } = require("../../../services/audio");

const getHydrated = async function (config) {
	if (config.versionKey !== "getHydrated") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	let outputType = "validBalance";
	if (!config.userCanPayCost && !config.diceRoll && !config.bypass) {
		outputType = "lowBalance";
	}
	if (!config.userCanPayCost && config.diceRoll && !config.bypass) {
		outputType = "luckyRoll";
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	if (
		config.hasAudioClip &&
		(outputType === "validBalance" || outputType === "luckyRoll")
	) {
		play({ channelId: config.channelId, chatName: config.chatName });
	}

	return output;
};

module.exports = getHydrated;
