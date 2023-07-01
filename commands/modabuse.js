const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const Title = require("../models/title");

const helper = new Helper();

let cooldown = 30000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (
				helper.isCooldownPassed(
					currentTime,
					modAbuse.getTimer(),
					modAbuse.getCooldown()
				) ||
				helper.isStreamer(config.userInfo)
			) {
				let entries = [];
				let index;
				modAbuse.setTimer(currentTime);

				if (
					helper.isVersionActive(versions, 0) &&
					!helper.isValuePresentAndString(config.argument)
				) {
					entries = await Title.aggregate([{ $sample: { size: 1 } }]);

					if (entries.length == 0) {
						result.push(
							"The mods don't seem to have been very abusive lately...with titles at least"
						);
					}
				} else if (helper.isValuePresentAndString(config.argument)) {
					if (helper.isVersionActive(versions, 1) && !isNaN(config.argument)) {
						let quote = await Title.findOne({ index: config.argument });

						if (quote) {
							entries.push(quote);
						} else {
							result.push("There is no ModAbuse " + config.argument);
						}
					} else if (
						helper.isVersionActive(versions, 2) &&
						isNaN(config.argument)
					) {
						entries = await Title.find({
							text: { $regex: config.argument, $options: "i" },
						});

						if (entries.length == 0) {
							result.push("No ModAbuse found mentioning: " + config.argument);
						}
					} else if (
						helper.isVersionActive(versions, 1) &&
						isNaN(config.argument)
					) {
						result.push("To get a ModAbsue by its ID use !modAbuse [number]");
					} else if (
						helper.isVersionActive(versions, 2) &&
						!isNaN(config.argument)
					) {
						result.push(
							"To get a random ModAbuse that includes specic text, use !modAbuse [text]"
						);
					} else if (helper.isVersionActive(versions, 0)) {
						result.push("To get a random ModAbuse, use !modAbuse");
					}
				} else if (
					!helper.isVersionActive(versions, 0) &&
					helper.isVersionActive(versions, 1) &&
					helper.isVersionActive(versions, 2) &&
					!helper.isValuePresentAndString(config.argument)
				) {
					result.push("Use !modAbuse [text], or !modAbuse [number]");
				} else if (
					!helper.isVersionActive(versions, 0) &&
					helper.isVersionActive(versions, 1) &&
					!helper.isVersionActive(versions, 2) &&
					!helper.isValuePresentAndString(config.argument)
				) {
					result.push("To get a ModAbsue by its ID use !modAbuse [number]");
				} else if (
					!helper.isVersionActive(versions, 0) &&
					!helper.isVersionActive(versions, 1) &&
					helper.isVersionActive(versions, 2) &&
					!helper.isValuePresentAndString(config.argument)
				) {
					result.push(
						"To get a random ModAbuse that includes specific text, use !modAbuse [text]"
					);
				}

				if (entries.length > 0) {
					index = helper.getRandomBetweenExclusiveMax(0, entries.length);
					result.push(entries[index].index + `. ` + entries[index].text);
				}
			}
			return result;
		},
	};
};

let versions = [
	{
		description: "Gets a random title",
		usage: "!modAbuse",
		usableBy: "users",
		active: true,
	},
	{
		description: "Gets title number 69",
		usage: "!modAbuse 69",
		usableBy: "users",
		active: true,
	},
	{
		description:
			"Gets a random title that includes the string 'sit on my face' uwu",
		usage: "!modAbuse sit on my face",
		usableBy: "users",
		active: true,
	},
];

const modAbuse = new TimerCommand(commandResponse, versions, cooldown);

exports.command = modAbuse;
