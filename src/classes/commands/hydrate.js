const BaseCommand = require("./baseCommand.js");
const { play } = require("../../services/audio/index.js");

async function action(config) {
	if (config.versionKey !== "noArgument") return;

	let outputType = "validBalance";
	if (!config.userCanPayCost && !config.diceRoll && !config.bypass) {
		outputType = "lowBalance";
	}
	if (!config.userCanPayCost && config.diceRoll && !config.bypass) {
		outputType = "luckyRoll";
	}

	const output = this.getProcessedOutputString(
		this.getOutput(outputType),
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
}

class Hydrate extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	action = action.bind(this);
}

module.exports = Hydrate;
