const { getStreamByUserId } = require("../../../services/twitch/streams");
const { splitArgs } = require("../../../utils/modify");
const { isValueNumber } = require("../../../utils/valueChecks");
const steam = require("../../../../bot-steam");

const suggestGame = async function (config) {
	if (config.versionKey !== "suggestGame") return;
	if (!config?.permitted) {
		return this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
	}
	const steamApi = steam.getApi();

	const stream = await getStreamByUserId(config.channelId);
	if (!stream) {
		return this.getProcessedOutputString(
			this.getOutput("noStream"),
			config.configMap
		);
	}
	const { first: steamUsername, second: option } = splitArgs(
		config.argument,
		0
	);
	let steamId;

	try {
		steamId = await steamApi.resolve(
			"https://steamcommunity.com/id/" + steamUsername
		);
	} catch (err) {
		config.configMap.set("error", err.message);

		return this.getProcessedOutputString(
			this.getOutput("idError"),
			config.configMap
		);
	}

	let steamGames;
	try {
		steamGames = await steamApi.getUserOwnedGames(steamId);
	} catch (err) {
		config.configMap.set("error", err.message);

		return this.getProcessedOutputString(
			this.getOutput("privateError"),
			config.configMap
		);
	}

	if (steamGames.length === 0) {
		return this.getProcessedOutputString(
			this.getOutput("noGames"),
			config.configMap
		);
	}

	let outputType;

	if (isValueNumber(option)) {
		// minutes played
		const minutes = option * 60;
		steamGames = steamGames.filter((game) => game.playTime <= minutes);
		config.configMap.set("hours", option);
		outputType = "timePlayed";
	} else if (option) {
		// percentage achievements
		const percent = option.slice(0, -1);
		steamGames = await this.achievementsCompleted(steamId, steamGames, percent);
		config.configMap.set("percent", option);
		outputType = "achievements%";
	} else if (!option) {
		outputType = "randomGame";
	}

	if (steamGames.length === 0) {
		return this.getProcessedOutputString(
			this.getOutput("noMatch"),
			config.configMap
		);
	}

	const shuffledGames = this.shuffle(steamGames);
	config.configMap.set("game", shuffledGames[0].name);

	return this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);
};

module.exports = suggestGame;
