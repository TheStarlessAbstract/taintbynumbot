const BaseCommand = require("./baseCommand.js");
const { getChannelFollowers } = require("../../services/twitch/channels");

async function action(config) {
	if (config.versionKey !== "noArgument") return;

	const channelFollowers = await getChannelFollowers(
		config.channelId,
		config.userId
	);

	let outputType = "following";

	if (!channelFollowers.data[0]) {
		outputType = "notFollowing";
	}

	let output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);
	if (!output) return;

	if (outputType === "following") {
		const follower = channelFollowers.data[0];
		const currentTimestamp = Date.now();
		const followStartTimestamp = follower.followDate.getTime();
		const followLength = this.getFollowLength(
			currentTimestamp - followStartTimestamp
		);

		output = output.replace("{followLength}", followLength);
	}

	return output;
}

class Followage extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	action = action.bind(this);

	getFollowLength(followTime) {
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
					(timeUnit.value > 1 ? timeUnit.name + "s" : timeUnit.name) +
					", ";
			}
		}

		followString = followString.slice(0, -2);
		followString += ".";

		return followString;
	}
}

module.exports = Followage;
