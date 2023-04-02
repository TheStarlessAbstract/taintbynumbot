const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const Tinder = require("../models/tinder");

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
					tinder.getTimer(),
					tinder.getCooldown()
				) ||
				helper.isStreamer(config)
			) {
				let entries = [];
				let index;
				tinder.setTimer(currentTime);

				if (
					helper.isVersionActive(versions, 0) &&
					!helper.isValuePresentAndString(config.argument)
				) {
					entries = await Tinder.aggregate([{ $sample: { size: 1 } }]);
					if (entries.length == 0) {
						result.push("Nobody has ever created Tinder bio for Starless");
					}
				} else if (helper.isValuePresentAndString(config.argument)) {
					if (helper.isVersionActive(versions, 1) && !isNaN(config.argument)) {
						let tinder;

						if (config.argument == 0) {
							tinder = await Tinder.findOne({}).sort("-index").exec();
						} else {
							tinder = await Tinder.findOne({ index: config.argument });
						}

						if (tinder) {
							entries.push(tinder);
						} else {
							result.push("There is no Tinder bio " + config.argument);
						}
					} else if (helper.isVersionActive(versions, 2)) {
						entries = await Tinder.find({
							text: { $regex: config.argument, $options: "i" },
						});

						if (!entries) {
							result.push("No Tinder bio found mentioning: " + config.argument);
						}
					}
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
		description: "Gets a random Tinder Bio",
		usage: "!tinderquote",
		usableBy: "users",
		active: true,
	},
	{
		description:
			"Gets Tinder Bio number 69. Use !tinderquote 0 to get the latest",
		usage: "!tinderquote 69",
		usableBy: "users",
		active: true,
	},
	{
		description:
			"Gets a random Tinder Bio that includes the string 'sit on my face' uwu",
		usage: "!tinderquote sit on my face",
		usableBy: "users",
		active: true,
	},
];

const tinder = new TimerCommand(commandResponse, versions, cooldown);

function getRandomBetweenExclusiveMax(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

exports.command = tinder;
