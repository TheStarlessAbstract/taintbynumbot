const CommandNew = require("../models/commandnew.js");
const {
	isValueNumber,
	isNonEmptyMap,
	isNonEmptyString,
	getUserRolesAsStrings,
} = require("../utils/index.js");

const { findOne } = require("../queries/loyaltyPoints");

class BaseCommand {
	constructor(command) {
		this.command = command;
		this.channels = {}; // currently channelId: { versions, output }
	}

	/**
	 * Adds a new channel to the `channels` object in the `BaseCommand` class.
	 * @param {string} channelId - The ID of the channel to be added.
	 * @param {object} channel - The channel object containing the versions and output maps.
	 * @returns {boolean} - True if the channel was successfully added, false otherwise.
	 */
	addChannel(channelId, channel) {
		if (
			typeof channelId !== "string" ||
			!(channel?.versions instanceof Map) ||
			!(channel?.output instanceof Map) ||
			channel?.versions.size == 0 ||
			channel?.output.size == 0 ||
			this.channels?.[channelId]
		)
			return false;

		this.channels[channelId] = channel;
		return true;
	}

	/**
	 * Retrieves a specific channel from the `channels` object in the `BaseCommand` class.
	 * @param {string} channelId - The ID of the channel to retrieve.
	 * @returns {Object|null} - The channel object corresponding to the provided `channelId`, if it exists. Otherwise, `null`.
	 */
	getChannel(channelId) {
		if (typeof channelId !== "string" || channelId.trim() === "") {
			return null;
		}
		return this.channels[channelId] || null;
	}

	/**
	 * Retrieves a specific channel from the `channels` object. If the channel does not exist, it queries the database to find the channel and adds it to the `channels` object.
	 * @param {Object} options - The options object.
	 * @param {string} options.channelId - The ID of the channel to retrieve.
	 * @param {string} options.chatName - The name of the chat command.
	 * @returns {Object|null} - The channel object corresponding to the provided `channelId`, if it exists. Otherwise, `null`.
	 */
	async checkChannel({ channelId, chatName }) {
		if (!isNonEmptyString(channelId) || !isNonEmptyString(chatName)) return;

		let channel = this.getChannel(channelId);

		if (!channel) {
			const command = await CommandNew.findOne(
				{ channelId, chatName },
				{ output: 1, versions: 1 }
			);
			if (!command) return;
			const { output, versions } = command;
			if (!isNonEmptyMap(output) || !isNonEmptyMap(versions)) return;

			channel = { output, versions };

			const response = this.addChannel(channelId, channel);
			if (!response) return;
		}

		return channel;
	}

	/**
	 * Checks if a user has enough loyalty points to pay for a command in a specific channel.
	 * @param {Object} options - The options object.
	 * @param {string} options.channelId - The ID of the channel where the command is being executed.
	 * @param {string} options.userId - The ID of the user executing the command.
	 * @param {number} cost - The cost of the command in loyalty points.
	 * @returns {Object} - An object containing the user information and a flag indicating if the user can pay for the command.
	 */
	async checkUserBalance({ channelId, userId }, cost) {
		if (
			!isNonEmptyString(channelId) ||
			!isNonEmptyString(userId) ||
			!isValueNumber(cost)
		)
			return;

		const user = await findOne({
			channelId: channelId,
			viewerId: userId,
		});

		if (!user || user.points < cost) return { user: {}, canPay: false };

		return { user, canPay: true };
	}

	/**
	 * Checks if a user has any of the permitted roles specified in the `permittedRoles` array.
	 * @param {object} userRoles - An object containing boolean properties representing the user's roles.
	 * @param {array} permittedRoles - An array of strings representing the roles that are allowed.
	 * @returns {boolean} - True if the user has any of the permitted roles, false otherwise.
	 */
	hasPermittedRoles(userRoles, permittedRoles) {
		if (
			typeof userRoles !== "object" ||
			!Array.isArray(permittedRoles) ||
			permittedRoles.length === 0
		)
			return;

		const roleStrings = getUserRolesAsStrings(userRoles);
		if (!roleStrings) return;

		return roleStrings.some((role) => permittedRoles.includes(role));
	}

	/**
	 * Checks if a certain amount of time has passed since the last time a command was used.
	 * @param {Date} lastUsed - The timestamp of when the command was last used.
	 * @param {number} cooldownLength - The length of the cooldown period in milliseconds.
	 * @returns {boolean} - True if the cooldown period has passed, false otherwise.
	 */
	isCooldownPassed(lastUsed, cooldownLength) {
		if (!(lastUsed instanceof Date) || !isValueNumber(cooldownLength))
			return false;
		if (cooldownLength <= 0) return true;

		const currentTime = Date.now();
		if (lastUsed > currentTime) return false;

		const timeDifference = currentTime - lastUsed;
		return timeDifference >= cooldownLength;
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

	getChannels() {
		return this.channels;
	}

	getCommand() {
		return this.command;
	}

	setChannels(channels) {
		this.channels = channels;
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

	// checking to see what version of the command to use, if there are multiple versions
	getCommandVersionKey(config, versions) {
		let hasArgument = false;
		let isNumber = false;
		let argument = config.argument;
		if (argument) {
			hasArgument = true;
			isNumber = isValueNumber(argument);
		}

		for (let [key, value] of versions) {
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
