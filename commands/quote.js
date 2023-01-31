const Quote = require("../models/quote");

let COOLDOWN = 30000;
let timer;

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

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (currentTime - timer > COOLDOWN || config.isBroadcaster) {
				let entries = [];
				let index;
				timer = currentTime;

				if (versions[0].active && !config.argument) {
					entries = await Quote.find({});

					if (!entries) {
						result.push("Starless has never said anything of note");
					}
				} else {
					if (versions[1].active && !isNaN(config.argument)) {
						let quote;
						quote = await Quote.findOne({ index: config.argument });
						if (quote) {
							entries.push(quote);
						} else {
							result.push(
								"No Starless quote found mentioning: " + config.argument
							);
						}
					} else if (
						versions[2].active &&
						config.argument &&
						isNaN(config.argument)
					) {
						entries = await Quote.find({
							text: { $regex: config.argument, $options: "i" },
						});

						if (!entries) {
							result.push(
								"There is no Starless quote number " + config.argument
							);
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

function getRandomBetweenExclusiveMax(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function setTimer(newTimer) {
	timer = newTimer;
}

function getVersions() {
	return versions;
}

function setVersionActive(element) {
	if (typeof element == "number" && element >= 0 && element < versions.length) {
		versions[element].active = !versions[element].active;
	}
}

exports.getCommand = getCommand;
exports.getVersions = getVersions;
exports.setVersionActive = setVersionActive;
exports.setTimer = setTimer;
