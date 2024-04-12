const Command = require("../../models/command.js"); // swap import with below when doing copy back to Command collection
const CommandNew = require("../../models/commandnew.js");

let twitchId = "100612361";

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

function template() {
	return new CommandNew({
		channelId: twitchId,
		chatName: "drinkBitch",
		type: "hydrate",
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
						"users",
					],
					cooldown: {
						length: 5000,
					},
					cost: 500,
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
