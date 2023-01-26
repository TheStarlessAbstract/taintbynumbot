const Tinder = require("../models/Tinder");

let COOLDOWN = 30000;
let timer;

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];
			let entries = [];
			let index;
			let quote;

			let currentTime = new Date();

			if (currentTime - timer > COOLDOWN) {
				tinderTimer = currentTime.getTime();

				if (!config.argument) {
					entries = await Tinder.find({});
				} else {
					if (!isNaN(config.argument)) {
						quote = await Tinder.findOne({ index: config.argument });
						if (quote) {
							entries.push(quote);
						}
					} else {
						entries = await Tinder.find({
							text: { $regex: config.argument, $options: "i" },
						});
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
				} else if (isNaN(config.argument)) {
					result.push("No Tinder bio found mentioning: " + config.argument);
				} else if (!config.argument) {
					result.push("Nobody has ever created Tinder bio for Starless");
				} else if (!isNaN(config.argument)) {
					result.push("There is no Tinder bio number " + config.argument);
				}
			}

			return result;
		},
		versions: [
			{
				description: "Gets a random Tinder Bio",
				usage: "!tinderquote",
				usableBy: "users",
			},
			{
				description: "Gets Tinder Bio number 69",
				usage: "!tinderquote 69",
				usableBy: "users",
			},
			{
				description:
					"Gets a random Tinder Bio that includes the string 'sit on my face' uwu",
				usage: "!tinderquote sit on my face",
				usableBy: "users",
			},
		],
	};
};

function getRandomBetweenExclusiveMax(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function setTimer(newTimer) {
	timer = newTimer;
}

exports.getCommand = getCommand;
exports.setTimer = setTimer;
