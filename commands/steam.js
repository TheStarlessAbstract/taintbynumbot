const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const steam = require("../bot-steam");

const helper = new Helper();

let cooldown = 10000;
let steamApi = steam.getApi();
let currentTime = new Date();

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			currentTime = new Date();

			if (
				helper.isValuePresentAndString(config.argument) &&
				(helper.isCooldownPassed(
					currentTime,
					steamNextGame.getTimer(),
					steamNextGame.getCooldown()
				) ||
					helper.isStreamer(config))
			) {
				steamNextGame.setTimer(currentTime);

				let steamUsername = config.argument;
				let steamUserId;

				try {
					steamUserId = await steamApi.resolve(
						"https://steamcommunity.com/id/" + steamUsername
					);
				} catch (e) {
					if (e.message == "No match") {
						result.push(
							"@" +
								config.userInfo.displayName +
								" Username not found, please check your Steam profile custom URL via Steam Profile > Edit Profile > Custom URL"
						);
					} else if (e.message == "Invalid format") {
						result.push(
							"@" +
								config.userInfo.displayName +
								"Steam says your URL is an invalid format, please check your Steam profile custom URL via Steam Profile > Edit Profile > Custom URL"
						);
					}
					return result;
				}

				let steamUserGames;
				try {
					steamUserGames = await steamApi.getUserOwnedGames(steamUserId);
				} catch (e) {
					if (e.message == "No games found") {
						result.push(
							"@" +
								config.userInfo.displayName +
								" Your Steam Profile or Game Details are set to private. Go to Steam profile > Edit Profile > Privacy Settings. Set My Profile, and Game Details to Public"
						);
					}
					return result;
				}

				if (steamUserGames.length > 100) {
					steamUserGames = gameRandomiser(steamUserGames);
				}

				let selectGames = [];
				let gamesNotPublic = [];

				for (let i = 0; i < steamUserGames.length; i++) {
					try {
						if (await userAchievements(steamUserId, steamUserGames[i])) {
							selectGames.push(steamUserGames[i].name);
						}
					} catch (e) {
						if (e instanceof Error) {
							if (e.message.includes("Requested app has no stats")) {
							} else {
								gamesNotPublic.push(steamUserGames[i].name);
							}
						} else {
							console.log(e);
						}
					}
				}

				if (steamUserGames.length == gamesNotPublic.length) {
					result.push(
						"@" +
							config.userInfo.displayName +
							" Your Steam Profile or Game Details are set to private. Go to Steam profile > Edit Profile > Privacy Settings. Set My Profile, and Game Details to Public"
					);
				} else if (selectGames.length > 0) {
					let index = helper.getRandomBetweenExclusiveMax(
						0,
						selectGames.length
					);

					result.push(
						"@" +
							config.userInfo.displayName +
							" You should play " +
							selectGames[index] +
							" next"
					);
				} else {
					result.push(
						"@" + config.userInfo.displayName + " No games with 0% achievments"
					);
				}
			}
			return result;
		},
	};
};

let versions = [
	{
		description: "Suggests a random game from your Steam library",
		usage: "!steam [steam custom url name]",
		usableBy: "users",
		active: true,
	},
];

const steamNextGame = new TimerCommand(commandResponse, versions, cooldown);

async function userAchievements(steamUserId, steamGame) {
	let userGameAchievments = await steamApi.getUserAchievements(
		steamUserId,
		steamGame.appID
	);
	let totalGameAchievments = userGameAchievments.achievements.length;
	let userTotalGameAchievements = 0;

	for (let j = 0; j < totalGameAchievments; j++) {
		if (userGameAchievments.achievements[j].achieved) {
			userTotalGameAchievements += 1;
		}
	}

	return userTotalGameAchievements < 1 ? true : false;
}

function gameRandomiser(gameArray) {
	let shuffledGames = helper.shuffle(gameArray);
	return shuffledGames.slice(0, 100);
}

exports.command = steamNextGame;
