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
		chatName: "t",
		type: "counterdecrease",
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
				"total",
				{
					message:
						"{channelName} has died {total} time(s) while ✨playing✨ {game}",
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
				"decreaseCounter",
				{
					isArgumentOptional: false,
					hasArgument: false,
					isArgumentNumber: false,
					description: "Starless has died again",
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
						length: 3000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster"],
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
