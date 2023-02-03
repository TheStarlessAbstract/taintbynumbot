const BaseCommand = require("../classes/base-command");

const chatClient = require("../bot-chatclient");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			const apiClient = chatClient.getApiClient();
			const follow = await apiClient.users.getFollowFromUserToBroadcaster(
				config.userInfo.userId,
				twitchId
			);

			if (follow) {
				const currentTimestamp = Date.now();
				const followStartTimestamp = follow.followDate.getTime();

				let followLength = getFollowLength(
					currentTimestamp - followStartTimestamp
				);

				result.push([
					"@" +
						config.userInfo.displayName +
						" has been following TheStarlessAbstract for " +
						followLength,
				]);
			} else {
				result.push([
					"@" +
						config.userInfo.displayName +
						" hit that follow button, otherwise this command is doing a whole lot of nothing for you",
				]);
			}

			return result;
		},
	};
};

let versions = [
	{
		description:
			"How long has it been since you last unfollowed, and then refollowed",
		usage: "!followage",
		usableBy: "users",
		active: true,
	},
];

const followage = new BaseCommand(commandResponse, versions);

function getFollowLength(followTime) {
	let second = Math.floor(followTime / 1000);
	let minute = Math.floor(second / 60);
	second = second % 60;
	let hour = Math.floor(minute / 60);
	minute = minute % 60;
	let day = Math.floor(hour / 24);
	hour = hour % 24;
	let year = Math.floor(day / 365);
	day = day % 365;
	let month = Math.floor(day / 30);
	day = day % 30;
	let week = Math.floor(day / 7);
	day = day % 7;

	const timeUnits = [
		{ value: year, name: "year" },
		{ value: month, name: "month" },
		{ value: week, name: "week" },
		{ value: day, name: "day" },
		{ value: hour, name: "hour" },
		{ value: minute, name: "minute" },
		{ value: second, name: "second" },
	];

	let followString = "";
	for (const timeUnit of timeUnits) {
		if (timeUnit.value > 0) {
			followString +=
				timeUnit.value +
				" " +
				(timeUnit.value > 1 ? timeUnit.name + "s" : timeUnit.name);
			(", ");
		}
	}

	followString = followString.slice(0, -2);
	followString += ".";

	return followString;
}

exports.command = followage;
