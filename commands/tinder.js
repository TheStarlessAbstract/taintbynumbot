const TimerCommand = require("../classes/timer-command");

const Tinder = require("../models/tinder");

let cooldown = 30000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (
				currentTime - tinder.getTimer() > tinder.getCooldown() ||
				config.isBroadcaster
			) {
				let entries = [];
				let index;
				tinder.setTimer(currentTime);

				if (tinder.getVersionActivity(0) && !config.argument) {
					entries = await Tinder.find({});

					if (!entries) {
						result.push("Nobody has ever created Tinder bio for Starless");
					}
				} else {
					if (tinder.getVersionActivity(1) && !isNaN(config.argument)) {
						let quote = await Tinder.findOne({ index: config.argument });

						if (quote) {
							entries.push(quote);
						} else {
							result.push("There is no Tinder bio number " + config.argument);
						}
					} else if (
						tinder.getVersionActivity(2) &&
						config.argument &&
						isNaN(config.argument)
					) {
						entries = await Tinder.find({
							text: { $regex: config.argument, $options: "i" },
						});

						if (!entries) {
							result.push("No Tinder bio found mentioning: " + config.argument);
						}
					}
				}

				if (entries.length > 0) {
					index = getRandomBetweenExclusiveMax(0, entries.length);
					result.push(entries[index].index + `. ` + entries[index].text);

					if (entries[index].user != "") {
						result.push(
							`This Tinder bio was brought to you by the glorious, and taint-filled @${entries[index].user}`
						);
					}
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
		description: "Gets Tinder Bio number 69",
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
