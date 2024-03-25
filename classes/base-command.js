const CommandNew = require("../models/commandnew.js");

class BaseCommand {
	constructor(command) {
		this.command = command;
		this.channels = {};
	}

	getCommand() {
		return this.command;
	}

	getChannels() {
		return this.channels;
	}

	getChannel(channelId) {
		return this.channels[channelId];
	}

	setChannels(channels) {
		this.channels = channels;
	}

	addChannel(channelId, channel) {
		this.channels[channelId] = channel;
	}

	async checkChannelForActiveVersion(channelId, command) {
		let isActive = this.#channelActiveVersion(channelId);
		if (isActive != -1) return isActive;

		isActive = await this.#dbActiveVersion(channelId, command);

		return isActive;
	}

	#channelActiveVersion(channelId) {
		let isActive = false;
		let channel = this.getChannel(channelId);

		if (!channel) return -1;

		const iterator = channel.versions.values();

		for (let i = 0; i < channel.versions.size; i++) {
			isActive = iterator.next().value.active;
			if (isActive) break;
		}

		return isActive;
	}

	async #dbActiveVersion(channelId, command) {
		const aggregateResult = await CommandNew.aggregate([
			{ $match: { streamerId: channelId, chatName: command } },
			{
				$project: {
					isActive: {
						$gt: [
							{
								$size: {
									$filter: {
										input: { $objectToArray: "$versions" },
										as: "version",
										cond: { $eq: ["$$version.v.active", true] },
									},
								},
							},
							0,
						],
					},
				},
			},
		]);

		return aggregateResult[0].isActive;
	}
}

module.exports = BaseCommand;
