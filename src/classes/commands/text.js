const BaseCommand = require("./baseCommand.js");

async function action(config) {
	if (config.versionKey !== "noArgument") return;

	const output = this.getProcessedOutputString(
		this.getOutput("text"),
		config.configMap
	);

	return output;
}

class Text extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	action = action.bind(this);
}

module.exports = Text;
