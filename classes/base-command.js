const CommandNew = require("../models/commandnew.js");
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

	async checkChannel(config, type) {
		let channel = this.getChannel([config.channelId]);

		if (!channel) {
			const userCommand = await CommandNew.findOne({
				channelId: config.channelId,
				type: type,
			});
			if (!userCommand) return;

			channel = {
				output: userCommand.output,
				versions: userCommand.versions,
			};
			const response = this.addChannel(config.channelId, channel);
			if (!response) return false;
		}

		return channel;
	}

	async checkCommandStatus(config, channel) {
		const versionKey = this.getCommandVersionKey(config, channel);
		if (!versionKey) return false;

		const commandRestriction = this.isCommandRestricted(
			config,
			channel.versions.get(versionKey)
		);
		console.log(commandRestriction);

		return !commandRestriction;
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

	isCommandRestricted(config, version) {
		const userAllowed = this.hasPermittedRoles(config, version.usableBy);
		if (!userAllowed) return true;

		if (!version?.cooldown) return false;

		const bypass = this.hasPermittedRoles(config, version.cooldown.bypassRoles);
		if (bypass) return false;

		const cooldown = !this.isCooldownPassed(
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
}

module.exports = BaseCommand;
