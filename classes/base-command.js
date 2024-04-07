const CommandNew = require("../models/commandnew.js");
const LoyaltyPoints = require("../models/loyaltypoints.js");
const { isValueNumber, configRoleStrings } = require("../src/utils");

class BaseCommand {
	constructor(command) {
		this.command = command;
		this.channels = {}; // currently channelId: { versions, output }
	}

	addChannel(channelId, channel) {
		if (
			typeof channelId !== "string" ||
			!channel?.versions ||
			!channel?.output ||
			this.channels?.[channelId]
		)
			return false;

		this.channels[channelId] = channel;
		return true;
	}

	getChannels() {
		return this.channels;
	}

	getChannel(channelId) {
		if (!this.channels[channelId]) return false;
		return this.channels[channelId];
	}

	getCommand() {
		return this.command;
	}

	setChannels(channels) {
		this.channels = channels;
	}

	async checkChannel(config) {
		let channel = this.getChannel([config.channelId]);

		if (!channel) {
			const userCommand = await CommandNew.findOne({
				channelId: config.channelId,
				chatName: config.chatName,
			});
			if (!userCommand) return;

			channel = {
				output: userCommand.output,
				versions: userCommand.versions,
			};
			const response = this.addChannel(config.channelId, channel);
			if (!response) return;
		}

		return channel;
	}

	async checkCommandStatus(config, channel) {
		const versionKey = this.getCommandVersionKey(config, channel);
		if (!versionKey) return;

		const commandAvailable = this.isCommandAvailable(
			config,
			channel.versions.get(versionKey)
		);
		if (!commandAvailable) return;

		return versionKey;
	}

	async checkChannelForActiveVersion(channelId, command) {
		let isActive = this.channelActiveVersion(channelId);
		if (isActive != -1) return isActive;

		isActive = await this.dbActiveVersion(channelId, command);

		return isActive;
	}

	channelActiveVersion(channelId) {
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

	async dbActiveVersion(channelId, command) {
		const aggregateResult = await CommandNew.aggregate([
			{ $match: { channelId: channelId, chatName: command } },
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

	isCommandAvailable(config, version) {
		const userAllowed = this.hasPermittedRoles(config, version.usableBy);
		if (!userAllowed) return false;

		if (!version?.cooldown) return true;

		const bypass = this.hasPermittedRoles(config, version.cooldown.bypassRoles);
		if (bypass) return true;

		const cooldown = this.isCooldownPassed(
			version.cooldown.lastUsed,
			version.cooldown.length
		);

		return cooldown;
	}

	isCooldownPassed(lastUsed, cooldownLength) {
		const time = new Date();
		return time - lastUsed >= cooldownLength;
	}

	hasPermittedRoles(config, permittedRoles) {
		const roleStrings = configRoleStrings(config);
		const found = roleStrings.some((r) => permittedRoles.includes(r));
		return found;
	}

	// checking to see what version of the command to use, if there are multiple versions
	getCommandVersionKey(config, channel) {
		let hasArgument = false;
		let isNumber = false;
		let argument = config.argument;
		if (argument) {
			hasArgument = true;
			isNumber = isValueNumber(argument);
		}

		for (let [key, value] of channel.versions) {
			if (!value.active) continue;
			if (
				!value.isArgumentOptional &&
				(value.hasArgument !== hasArgument ||
					value.isArgumentNumber !== isNumber)
			)
				continue;

			if (
				value.isArgumentOptional &&
				hasArgument &&
				value.isArgumentNumber &&
				!isNumber
			)
				continue;

			return key;
		}
		return false;
	}

	async checkUserBalance(config, cost) {
		const user = await LoyaltyPoints.findOne({
			channelId: config.channelId,
			viewerId: config.userId,
		}).exec();
		if (!user || user.points < cost) return;

		return true;
	}

	async checkCommandCanRun(config) {
		const channel = await this.checkChannel(config);
		if (!channel) return;

		const versionKey = await this.checkCommandStatus(config, channel);
		if (!versionKey) return;

		const cost = channel.versions.get(versionKey)?.cost;
		if (cost && cost > 0) {
			const balance = await this.checkUserBalance(config, cost);
			if (!balance) return;
		}

		return { version: versionKey, output: channel.output };
	}
}

module.exports = BaseCommand;
