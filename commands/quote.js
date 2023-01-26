const Quote = require("../models/quote");

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
				timer = currentTime.getTime();

				if (!config.argument) {
					entries = await Quote.find({});
				} else {
					if (!isNaN(config.argument)) {
						quote = await Quote.findOne({ index: config.argument });
						if (quote) {
							entries.push(quote);
						}
					} else {
						entries = await Quote.find({
							text: { $regex: config.argument, $options: "i" },
						});
					}
				}

				if (entries.length > 0) {
					index = getRandomBetweenExclusiveMax(0, entries.length);

					result.push(entries[index].index + `. ` + entries[index].text);
				} else if (isNaN(config.argument)) {
					result.push("No Starless quote found mentioning: " + config.argument);
				} else if (!config.argument) {
					result.push("Starless has never said anything of note");
				} else if (!isNaN(config.argument)) {
					result.push("There is no Starless quote number " + config.argument);
				}
			}
			return result;
		},
		versions: [
			{
				description: "Gets a random quote",
				usage: "!quote",
				usableBy: "users",
			},
			{
				description: "Gets quote number 69",
				usage: "!quote 69",
				usableBy: "users",
			},
			{
				description:
					"Gets a random quote that includes the string 'sit on my face' uwu",
				usage: "!quote sit on my face",
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
