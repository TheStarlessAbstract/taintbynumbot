const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const twitchService = require("../services/twitch");

const LoyaltyPoint = require("../models/loyaltypoint");

const helper = new Helper();

let cooldown = 5000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let currentTime = new Date();
			let user;

			if (
				points.getVersionActivity(0) &&
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
					twitchId: config.channelId,
					userId: config.userInfo.userId,
				});

				if (!user) {
					return `@${config.userInfo.displayName} I hate to say it, but it looks like you haven't been here for a whole 5 minutes yet. Hang around a bit longer to get your self some Tainty Points.`;
				}
				return `@${config.userInfo.displayName} has ${user.points} Tainty Points`;
			} else if (
				points.getVersionActivity(1) &&
				helper.isStreamer(config.userInfo) &&
				helper.isValuePresentAndString(config.argument)
			) {
				let username = helper.getCommandArgumentKey(config.argument, 0);
				let newPoints = helper.getCommandArgumentKey(config.argument, 1);

				if (
					!helper.isValuePresentAndString(username) ||
					!helper.isValuePresentAndNumber(newPoints)
				) {
					return `@TheStarlessAbstract it's not that hard, just !points [username] [number]`;
				}

				if (username.startsWith("@")) {
					username = username.substring(1);
				}

				let twitchUser = await twitchService.getUserByName(
					username.toLowerCase()
				);

				if (!twitchUser) {
					return `TheStarlessAbstract no user found called ${username}`;
				}

				user = await LoyaltyPoint.findOne({
					twitchId: config.channelId,
					userId: twitchUser.id,
				});

				if (!user) {
					return `@TheStarlessAbstract doesn't look like @${username} can be given points just yet`;
				}

				user.points += Number(newPoints);
				await user.save();

				return `Our glorious leader Starless, has given @${username} ${newPoints} Tainty Points`;
			} else if (
				!helper.isStreamer(config.userInfo) &&
				helper.isValuePresentAndString(config.argument)
			) {
				return `@${config.userInfo.displayName} you aren't allowed to use this command like that`;
			}
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
