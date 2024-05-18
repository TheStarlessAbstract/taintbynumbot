const BaseCommand = require("../baseCommand.js");
const steam = require("../../../../bot-steam");

class Steam extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	async achievementsCompleted(userId, games, percent) {
		const steamApi = steam.getApi();

		if (games.length > 100) {
			const shuffledGames = this.shuffle(games);
			games = shuffledGames.slice(0, 100);
		}

		const percentMatchedGames = games.filter(async (game) => {
			let steamGame;
			try {
				steamGame = await steamApi.getUserAchievements(userId, game.appID);
			} catch (err) {
				return false;
			}
			const countCompleted = steamGame.achievements.filter(
				(achievement) => achievement.achieved
			).length;

			const percentComplete =
				(countCompleted / steamGame.achievements.length) * 100;

			return percentComplete <= percent;
		});

		return percentMatchedGames;
	}
}

module.exports = Steam;
