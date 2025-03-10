const { aggregate } = require("../../queries/audioLinks");
const { play } = require("../../services/audio");

const getHydrated = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	if (!config.userCanPayCost && !config.diceRoll && !config.bypass) {
		return this.getOutputString("lowBalance", config.configMap);
	}

	let outputType = "validBalance";
	if (!config.userCanPayCost && config.diceRoll && !config.bypass)
		outputType = "luckyRoll";

	let output = this.getOutputString(outputType, config.configMap);

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
	if (audioLinks.length === 0) return output;

	play(config.channelId, audioLinks[0].url);

	return output;
};

module.exports = getHydrated;
