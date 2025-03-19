const { splitArgs } = require("../../utils/modify");
const { isValueNumber } = require("../../utils/valueChecks");

const suggestGame = async function (config) {
	// config used { permitted, channelId, configMap, argument }
	if (!this.isPermitted(config.permitted))
		return this.getOutputString("notPermitted", config.configMap);

	const { first: steamUsername, second: option } = splitArgs(
		config.argument,
		0
	);

	if (
		option &&
		!(
			isValueNumber(option) ||
			(option.endsWith("%") && !isNaN(parseFloat(option.slice(0, -1))))
		)
	) {
		return this.getOutputString("invalidOption", config.configMap);
	}

	let steamId;

	try {
		steamId = await this.steamApi.resolve(
			"https://steamcommunity.com/id/" + steamUsername
		);
	} catch (err) {
		config.configMap.set("error", err.message);
		return this.getOutputString("idError", config.configMap);
	}

	let steamGames;

	try {
		steamGames = await this.steamApi.getUserOwnedGames(steamId);
	} catch (err) {
		config.configMap.set("error", err.message);
		return this.getOutputString("privateError", config.configMap);
	}

	if (steamGames.length === 0)
		return this.getOutputString("noGames", config.configMap);

	let outputType;
	if (isValueNumber(option)) {
		// minutes played
		const minutes = parseInt(option) * 60;
		let test = steamGames.filter((game) => game.playTime <= minutes);

		if (test.length === 0)
			return this.getOutputString("noMatch", config.configMap);

		config.configMap.set("hours", option);
		outputType = "timePlayed";
	} else if (option) {
		// percentage achievements
		const percentage = option.slice(0, -1);
		steamGames = await this.achievementsCompleted(
			steamId,
			steamGames,
			percentage
		);
		config.configMap.set("percent", option);
		outputType = "achievements%";
	} else if (!option) {
		outputType = "randomGame";
	}

	if (steamGames.length === 0)
		return this.getOutputString("noMatch", config.configMap);

	const shuffledGames = this.shuffle(steamGames);
	config.configMap.set("game", shuffledGames[0].name);

	return this.getOutputString(outputType, config.configMap);
};

module.exports = suggestGame;
