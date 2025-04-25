const BaseCommand = require("./baseCommand");
const steam = require("../../repos/steam");
const { isValueNumber } = require("../../utils/valueChecks");

class Steam extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
		this.steamApi = steam.getApi();
	}

	async achievementsCompleted(userId, games, percent) {
		if (games.length > 100) {
			const shuffledGames = this.shuffle(games);
			games = shuffledGames.slice(0, 100);
		}

		let percentMatchedGames = [];

		for (let i = 0; i < games.length; i++) {
			let steamGame;
			try {
				steamGame = await this.steamApi.getUserAchievements(
					userId,
					games[i].appID
				);
			} catch (err) {
				continue;
			}

			const countCompleted = steamGame.achievements.filter(
				(achievement) => achievement.achieved
			).length;

			const percentComplete =
				(countCompleted / steamGame.achievements.length) * 100;

			if (percentComplete <= percent)
				percentMatchedGames.push({
					name: games[i].name,
					percentage: percentComplete,
				});
		}

		return percentMatchedGames;
	}

	validOption(option) {
		if (!option) return false;
		if (
			option &&
			(isValueNumber(option) ||
				(option.endsWith("%") && isValueNumber(option.slice(0, -1))))
		)
			return true;

		return false;
	}
}

module.exports = Steam;
