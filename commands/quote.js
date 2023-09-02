const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const Quote = require("../models/quote");

const helper = new Helper();

let cooldown = 10000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (
				helper.isCooldownPassed(
					currentTime,
					quote.getTimer(),
					quote.getCooldown()
				) ||
				helper.isStreamer(config.userInfo)
			) {
				let entries = [];
				let index;
				quote.setTimer(currentTime);

				if (
					helper.isVersionActive(versions, 0) &&
					!helper.isValuePresentAndString(config.argument)
				) {
					entries = await Quote.aggregate([{ $sample: { size: 1 } }]);
					if (entries.length == 0) {
						result.push("Starless has never said anything of note");
					}
				} else if (helper.isValuePresentAndString(config.argument)) {
					if (helper.isVersionActive(versions, 1) && !isNaN(config.argument)) {
						let quote = await Quote.findOne({ index: config.argument });

						if (quote) {
							entries.push(quote);
						} else {
							result.push("There is no Quote " + config.argument);
						}
					} else if (helper.isVersionActive(versions, 2)) {
						entries = await Quote.find({
							text: { $regex: config.argument, $options: "i" },
						});

						if (!entries) {
							result.push("No Quote found mentioning: " + config.argument);
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
		description: "Gets a random quote",
		usage: "!quote",
		usableBy: "users",
		active: true,
	},
	{
		description: "Gets quote number 69",
		usage: "!quote 69",
		usableBy: "users",
		active: true,
	},
	{
		description:
			"Gets a random quote that includes the string 'sit on my face' uwu",
		usage: "!quote sit on my face",
		usableBy: "users",
		active: true,
	},
];

const quote = new TimerCommand(commandResponse, versions, cooldown);

exports.command = quote;
