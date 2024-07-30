const BaseCommand = require("../baseCommand.js");
const { aggregate } = require("../../../queries/counters");

class Counter extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	async count(game) {
		const pipeline = [
			{
				$match: {
					channelId: this.channelId,
					name: this.name,
					gameTitle: game,
				},
			},
			{
				$group: {
					_id: null,
					total: { $sum: "$count" },
				},
			},
		];

		const counter = await aggregate(pipeline);
		return counter[0]?.total || 0;
	}
}

module.exports = Counter;
