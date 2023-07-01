const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const chatClient = require("../bot-chatclient");

const LoyaltyPoint = require("../models/loyaltypoint");

const helper = new Helper();

let cooldown = 5000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();
			let user;

			if (
				helper.isVersionActive(versions, 0) &&
				!helper.isValuePresentAndString(config.argument) &&
				helper.isCooldownPassed(
					currentTime,
					points.getTimer(),
					points.getCooldown()
				) &&
				!helper.isStreamer(config.userInfo)
			) {
				points.setTimer(currentTime);

				user = await LoyaltyPoint.findOne({
					userId: config.userInfo.userId,
				});

				if (user) {
					result.push(
						"@" +
							config.userInfo.displayName +
							" has " +
							user.points +
							" Tainty Points"
					);
				} else {
					result.push(
						"@" +
							config.userInfo.displayName +
							" I hate to say it, but it looks like you haven't been here for a whole 5 minutes yet. Hang around a bit longer to get your self some Tainty Points."
					);
				}
			} else if (
				helper.isVersionActive(versions, 1) &&
				helper.isStreamer(config.userInfo) &&
				helper.isValuePresentAndString(config.argument)
			) {
				let username = helper.getCommandArgumentKey(config.argument, 0);
				let newPoints = helper.getCommandArgumentKey(config.argument, 1);

				if (
					helper.isValuePresentAndString(username) &&
					helper.isValuePresentAndNumber(newPoints)
				) {
					if (username.startsWith("@")) {
						username = username.substring(1);
					}

					const apiClient = await chatClient.getApiClient();
					user = await apiClient.users.getUserByName(username.toLowerCase());

					if (user) {
						user = await LoyaltyPoint.findOne({
							userId: user.id,
						});

						if (user) {
							user.points += Number(newPoints);
							await user.save();

							result.push(
								"Our glorious leader Starless, has given @" +
									username +
									" " +
									newPoints +
									" Tainty Points"
							);
						} else {
							result.push(
								"@TheStarlessAbstract doesn't look like @" +
									username +
									" can be given points just yet"
							);
						}
					} else {
						result.push(
							"@TheStarlessAbstract no user found called " + username
						);
					}
				} else {
					result.push(
						"@TheStarlessAbstract it's not that hard, just !points [username] [number]"
					);
				}
			} else if (
				!helper.isStreamer(config.userInfo) &&
				helper.isValuePresentAndString(config.argument)
			) {
				result.push(
					"@" +
						config.userInfo.displayName +
						" you aren't allowed to use this command like that"
				);
			}

			return result;
		},
	};
};

let versions = [
	{
		description:
			"Check how many Tainty Points you have. You are going to need some for !drinkbitch, and !kings",
		usage: "!points",
		usableBy: "users",
		active: true,
	},
	{
		description: "Give points to a user",
		usage: "!points @buhhsbot 2000",
		usableBy: "streamer",
		active: true,
	},
];

const points = new TimerCommand(commandResponse, versions, cooldown);

exports.command = points;
