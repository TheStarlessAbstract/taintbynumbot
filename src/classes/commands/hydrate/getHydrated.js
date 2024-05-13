const { aggregate } = require("../../../queries/audioLinks");
const { play } = require("../../../services/audio");

const getHydrated = async function (config) {
	if (config.versionKey !== "getHydrated") return;
	let output;

	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	if (!config.userCanPayCost && !config.diceRoll && !config.bypass) {
		return this.getProcessedOutputString(
			this.getOutput("lowBalance"),
			config.configMap
		);
	}

	let outputType = "validBalance";
	if (!config.userCanPayCost && config.diceRoll && !config.bypass) {
		outputType = "luckyRoll";
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	if (!this.versionHasAudioClip(config.versionKey)) return output;

	const pipeline = [
		{
			$match: {
				channelId: config.channelId,
				command: config.chatName,
			},
		},
		{ $sample: { size: 1 } },
	];
	const audioLinks = await aggregate(pipeline);
	console.log(audioLinks);
	if (audioLinks.length === 0) return output;

	play(config.channelId, audioLinks[0].url);

	return output;
};

module.exports = getHydrated;
