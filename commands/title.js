const Title = require("../models/title");

let COOLDOWN = 30000;
let timer;

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (currentTime - timer > COOLDOWN) {
				let entries = [];
				let index;
				let quote;
				timer = currentTime;

				if (!config.argument) {
					entries = await Title.find({});
				} else {
					if (!isNaN(config.argument)) {
						quote = await Title.findOne({ index: config.argument });
						if (quote) {
							entries.push(quote);
						}
					} else {
						entries = await Title.find({
							text: { $regex: config.argument, $options: "i" },
						});
					}
				}

				if (entries.length > 0) {
					index = getRandomBetweenExclusiveMax(0, entries.length);
					result.push(entries[index].index + `. ` + entries[index].text);
					if (quote.user != "") {
						result.push(
							`This possible streamer harassment was brought to you by the glorious, and taint-filled @${entries[index].user}`
						);
					}
				} else if (isNaN(config.argument)) {
					result.push("No Title found mentioning: " + config.argument);
				} else if (!config.argument) {
					result.push(
						"The mods don't seem to have been very abusive lately...with titles"
					);
				} else if (!isNaN(config.argument)) {
					result.push("There is no title number " + config.argument);
				}
			}
			return result;
		},
		versions: [
			{
				description: "Gets a random title",
				usage: "!titleharassment",
				usableBy: "users",
			},
			{
				description: "Gets title number 69",
				usage: "!titleharassment 69",
				usableBy: "users",
			},
			{
				description:
					"Gets a random title that includes the string 'sit on my face' uwu",
				usage: "!titleharassment sit on my face",
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
