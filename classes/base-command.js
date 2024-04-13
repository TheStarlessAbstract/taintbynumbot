const CommandNew = require("../src/models/commandnew.js");
const LoyaltyPoints = require("../models/loyaltypoint.js");
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

	/**
	 * Retrieves a specific channel from the `channels` object in the `BaseCommand` class.
	 * @param {string} channelId - The ID of the channel to retrieve.
	 * @returns {Object|undefined} - The channel object with the specified `channelId` if it exists, or `undefined` if it does not exist.
	 */
	getChannel(channelId) {
		return this.channels[channelId] || false;
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

		const version = channel.versions.get(versionKey);
		const cost = version?.cost;
		const hasAudioClip = version.hasAudioClip;

		const commandAvailable = this.isCommandAvailable(config, version);
		if (!commandAvailable) return;

		return { versionKey, cost, hasAudioClip };
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
		if (!user || user.points < cost) return { user: {}, canPay: false };

		return { user: user, canPay: true };
	}

	async checkCommandCanRun(config) {
		// returns {output: {map}, versions: {map}}
		const channel = await this.checkChannel(config);
		const response = { output: channel?.output };
		if (!channel) return;

		// returns string of version type
		const { versionKey, cost, hasAudioClip } = await this.checkCommandStatus(
			config,
			channel
		);
		response.version = versionKey;
		response.hasAudioClip = hasAudioClip;
		if (!versionKey) return;

		response.userCanPayCost = true;
		if (cost && cost > 0) {
			const { user, canPay } = await this.checkUserBalance(config, cost);
			response.cost = cost;
			response.user = user;
			response.userCanPayCost = canPay;
		}

		return response;
	}
}

module.exports = BaseCommand;
