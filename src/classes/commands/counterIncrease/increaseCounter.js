const { findOne, create } = require("../../../queries/counters");
const { getStreamByUserId } = require("../../../services/twitch/streams");
const { aggregate } = require("../../../queries/audioLinks");
const { play } = require("../../../services/audio");

const increaseCounter = async function (config) {
	if (config.versionKey !== "increaseCounter") return;
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
			count: 1,
		});

		config.configMap.set("total", 1);
	} else {
		counter.count++;
		config.configMap.set("total", counter.count);
		counter.save();
	}

	const pipeline = [
		{
			$match: {
				channelId: this.channelId,
				command: this.name,
			},
		},
		{ $sample: { size: 1 } },
	];
	const audioLinks = await aggregate(pipeline);
	console.log(audioLinks);
	if (audioLinks.length > 0) play(config.channelId, audioLinks[0].url);

	return this.getProcessedOutputString(
		this.getOutput("total"),
		config.configMap
	);
};

module.exports = increaseCounter;
