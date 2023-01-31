const DeathCounter = require("../models/deathcounter");

const chatClient = require("../bot-chatclient");

let twitchId = process.env.TWITCH_USER_ID;

let versions = [
	{
		description: "Gets total deaths for current game",
		usage: "!deaths",
		usableBy: "users",
		active: true,
	},
];

const getCommand = () => {
	return {
		response: async () => {
			let result = [];

			try {
				let apiClient = chatClient.getApiClient();
				let channel = await apiClient.channels.getChannelInfoById(twitchId);

				let deathCounters = await DeathCounter.find({
					gameTitle: channel.gameName,
				});

				let gameDeaths = deathCounters.reduce(
					(total, counter) => total + counter.deaths,
					0
				);

				result.push(
					"Starless has died a grand total of " +
						gameDeaths +
						" times, while ✨playing✨ " +
						channel.gameName
				);
			} catch (err) {
				result.push(
					"Twitch isn't being very helpful right now, try again later"
				);
			}
			return result;
		},
	};
};

function getVersions() {
	return versions;
}

function setVersionActive(element) {
	versions[element].active = !versions[element].active;
}

exports.getCommand = getCommand;
exports.getVersions = getVersions;
exports.setVersionActive = setVersionActive;
