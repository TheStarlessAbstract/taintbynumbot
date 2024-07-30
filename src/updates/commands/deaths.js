// const Command = require("../../models/command.js");
const Command = require("../../models/commandnew.js");

let twitchId = "100612361";

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

function template() {
	return new Command({
		channelId: twitchId,
		chatName: "deaths",
		type: "counter",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"notPermitted",
				{
					message: "User not allowed",
					active: false,
				},
			],
			[
				"channelNotLive",
				{
					message: "{channelName} not streaming right now",
					active: true,
				},
			],
			[
				"total",
				{
					message:
						"{channelName} has died {total} number of times while ✨playing✨ {game}",
					active: true,
				},
			],
			[
				"error",
				{
					message: "",
					active: false,
				},
			],
		]),
		versions: new Map([
			[
				"getCounterForCategory",
				{
					isArgumentOptional: true,
					hasArgument: false,
					isArgumentNumber: false,
					description:
						"Gets the total deaths current or specified game category",
					active: true,
					usableBy: [
						"broadcaster",
						"artists",
						"founders",
						"mods",
						"subs",
						"vips",
						"viewers",
					],
					cooldown: {
						length: 10000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster", "mods"],
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
