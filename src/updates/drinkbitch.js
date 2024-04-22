const Command = require("../../models/command.js"); // swap import with below when doing copy back to Command collection
const CommandNew = require("../models/commandnew.js");

let twitchId = "100612361";

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

function template() {
	return new CommandNew({
		channelId: twitchId,
		chatName: "drinkbitch",
		type: "hydrate",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"validBalance",
				{
					message: "@{displayName} drink, bitch!",
					active: true,
				},
			],
			[
				"luckyRoll",
				{
					message:
						"@{displayName} You lack the points to make Starless drink, but The Church of Latter-Day Taints takes pity on you. @TheStarlessAbstract drink, bitch!",
					active: true,
				},
			],
			[
				"lowBalance",
				{
					message:
						"@{displayName} You lack the points to make Starless drink, hang about stream if you have nothing better to do, and maybe you too can make Starless !drinkbitch",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"noArgument",
				{
					isArgumentOptional: false,
					hasArgument: false,
					isArgumentNumber: false,
					description:
						"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
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
						length: 5000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster"],
					},
					cost: { active: true, points: 500, bypassRoles: ["broadcaster"] },
					hasAudioClip: true,
					luck: {
						active: true,
						odds: 100,
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
