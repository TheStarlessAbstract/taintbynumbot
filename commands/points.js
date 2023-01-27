const chatClient = require("../bot-chatclient");

const LoyaltyPoint = require("../models/loyaltypoint");

let COOLDOWN = 5000;
let timer;

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (currentTime - timer > COOLDOWN || config.isBroadcaster) {
				let user;
				timer = currentTime;

				if (!config.argument) {
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
				} else if (config.isBroadcaster && isNaN(config.argument)) {
					let username;
					if (config.argument.startsWith("@")) {
						username = config.argument.substring(1).split(" ");
					} else {
						username = config.argument.split(" ");
					}
					if (username.length == 2) {
						let newPoints = username[1];
						username = username[0];

						const apiClient = chatClient.getApiClient();
						user = await apiClient.users.getUserByName(username.toLowerCase());

						user = await LoyaltyPoint.findOne({
							userId: user.id,
						});

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
							"@TheStarlessAbstract it's not that hard, just !points username number"
						);
					}
				} else if (config.isBroadcaster && !isNaN(config.argument)) {
					result.push(
						"@TheStarlessAbstract you used the command wrong, you utter swine"
					);
				} else if (!config.isBroadcaster && config.argument) {
					result.push(
						"@" +
							config.userInfo.displayName +
							" you aren't allowed to this command like that"
					);
				}
			}
			return result;
		},
		versions: [
			{
				description:
					"Check how many Tainty Points you have. You are going to need some for !drinkbitch, and !kings",
				usage: "!points",
				usableBy: "users",
			},
			{
				description: "Give points to a user",
				usage: "!points 2000 @buhhsbot",
				usableBy: "streamer",
			},
		],
	};
};

function setTimer(newTimer) {
	timer = newTimer;
}

exports.getCommand = getCommand;
exports.setTimer = setTimer;
