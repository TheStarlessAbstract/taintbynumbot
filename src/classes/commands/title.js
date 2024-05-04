const BaseCommand = require("./baseCommand.js");
const { getStreamByUserId } = require("../../services/twitch/streams");
const { updateChannelInfo } = require("../../services/twitch/channels");

async function action(config) {
	if (
		config.versionKey !== "noArgument" &&
		config.versionKey !== "stringArgument"
	)
		return;

	let output;
	let outputType;
	const stream = await getStreamByUserId(config.channelId);
	outputType = "noStream";

	if (config.versionKey == "noArgument" && stream) {
		outputType = "streamIsLive";
		config.configMap.set("title", stream.title);
	}
	if (config.versionKey == "stringArgument" && stream) {
		outputType = "updateTitle";
		config.configMap.set("newTitle", config.argument);

		if (stream.title === config.argument) outputType = "existingTitle";
	}

	if (outputType === "updateTitle") {
		const data = { title: config.configMap.get("newTitle") };
		const res = await updateChannelInfo(config.channelId, data);
		if (!res.success) outputType = "error";
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);

	return output;
}

class Title extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	action = action.bind(this);
}

module.exports = Title;
