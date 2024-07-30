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
		chatName: "setdeaths",
		type: "counterset",
		createdBy: twitchId,
		createdOn: new Date(),
		commandGroup: "deaths",
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
				"set",
				{
					message: "{channelName} total deaths for {game} set to {set}",
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
				"setCounter",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: true,
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
