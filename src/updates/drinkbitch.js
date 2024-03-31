const Command = require("../../models/command.js"); // swap import with below when doing copy back to Command collection
const CommandNew = require("../../models/commandnew.js");

let twitchId = 100612361;

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

function template() {
	return new CommandNew({
		channelId: twitchId,
		chatName: "drinkBitch",
		defaultName: "hydrate",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"userNotInDatabase",
				{
					message:
						"@{displayName} It doesn't look like you have been here before, hang around, enjoy the mods abusing Starless, and maybe you too in time can make Starless !drinkBitch",
					active: true,
				},
			],
			[
				"validBalance",
				{
					message: "@TheStarlessAbstract drink, bitch!",
					active: true,
				},
			],
			[
				"luckyShot",
				{
					message:
						"@{displayName} You lack the points to make Starless drink, but The Church of Latter-Day Taints takes pity on you. @TheStarlessAbstract drink, bitch!",
					active: true,
				},
			],
			[
				"invalidBalance",
				{
					message:
						"@{displayName} You lack the points to make Starless drink, hang about stream if you have nothing better to do, and maybe you too can make Starless !drinkbitch",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"noArguement",
				{
					description:
						"@{displayName} finds a comfortable spot behind the bushes to perv on the stream",
					active: true,
					usableBy: {
						broadcaster: false,
						mods: true,
						vips: true,
						artists: true,
						users: true,
					},
					cooldown: {
						length: 5000,
					},
					cost: 500,
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
