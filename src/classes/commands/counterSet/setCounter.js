const { findOne, create } = require("../../../queries/counters");
const { getStreamByUserId } = require("../../../services/twitch/streams");

const setCounter = async function (config) {
	if (config.versionKey !== "setCounter") return;
	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}

	const stream = await getStreamByUserId(this.channelId);
	if (!stream)
		return this.getProcessedOutputString(
			this.getOutput("channelNotLive"),
			config.configMap
		);

	const game = stream.gameName;
	const date = stream.startDate;

	config.configMap.set("game", game);

	let counter = await findOne({
		channelId: this.channelId,
		name: this.commandGroup,
		gameTitle: game,
		streamStartDate: date,
	});

	if (!counter) {
		await create({
			channelId: this.channelId,
			name: this.commandGroup,
			gameTitle: game,
			streamStartDate: date,
			count: config.argument,
		});
	} else {
		counter.count = config.argument;
		counter.save();
	}

	config.configMap.set("set", config.argument);

	return this.getProcessedOutputString(this.getOutput("set"), config.configMap);
};

module.exports = setCounter;
