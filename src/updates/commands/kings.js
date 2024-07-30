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
		chatName: "kings++",
		type: "cardgame",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"noStream",
				{
					message:
						"@{displayName} - {channelName} doesn't seem to be streaming right now",
					active: true,
				},
			],
			[
				"notPermitted",
				{
					message: "@{displayName} - You are not permitted to use this command",
					active: false,
				},
			],
			[
				"card",
				{
					message: "@{displayName} You have drawn the {value} of {suit}",
					active: true,
				},
			],
			[
				"rule",
				{
					message: "Rule: {rule} || {explanation}",
					active: true,
				},
			],
			[
				"noGame",
				{
					message: "No game found",
					active: true,
				},
			],
			[
				"newGame",
				{
					message: "New game has been dealt",
					active: true,
				},
			],
			[
				"bonus1",
				{
					message: "Dazed Sucks",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"drawACard",
				{
					isArgumentOptional: true,
					hasArgument: false,
					isArgumentNumber: false,
					description: "Pulls a card from the deck for the !Kings game",
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
						bypassRoles: ["broadcaster"],
					},
					cost: {
						active: true,
						points: 100,
						bypassRoles: ["broadcaster"],
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
