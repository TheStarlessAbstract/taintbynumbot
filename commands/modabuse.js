const TimerCommand = require("../classes/timer-command");

const Title = require("../models/title");

let cooldown = 30000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (
				currentTime - modabuse.getTimer() > modabuse.getCooldown() ||
				config.isBroadcaster
			) {
				let entries = [];
				let index;
				let quote;
				modabuse.setTimer(currentTime);

				if (modabuse.getVersionActivity(0) && !config.argument) {
					entries = await Title.find({});

					if (!entries) {
						result.push(
							"The mods don't seem to have been very abusive lately...with titles"
						);
					}
				} else {
					if (modabuse.getVersionActivity(1) && !isNaN(config.argument)) {
						quote = await Title.findOne({ index: config.argument });
						if (quote) {
							entries.push(quote);
						} else {
							result.push("There is no title number " + config.argument);
						}
					} else if (
						modabuse.getVersionActivity(2) &&
						config.argument &&
						isNaN(config.argument)
					) {
						entries = await Title.find({
							text: { $regex: config.argument, $options: "i" },
						});

						if (!entries) {
							result.push("No Title found mentioning: " + config.argument);
						}
					}
				}

				if (entries.length > 0) {
					index = getRandomBetweenExclusiveMax(0, entries.length);
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
		usage: "!modabuse",
		usableBy: "users",
		active: true,
	},
	{
		description: "Gets title number 69",
		usage: "!modabuse 69",
		usableBy: "users",
		active: true,
	},
	{
		description:
			"Gets a random title that includes the string 'sit on my face' uwu",
		usage: "!modabuse sit on my face",
		usableBy: "users",
		active: true,
	},
];

const modabuse = new TimerCommand(commandResponse, versions, cooldown);

function getRandomBetweenExclusiveMax(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

exports.command = modabuse;
