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
		chatName: "kingsremain++",
		type: "cardgameremain",
		createdBy: twitchId,
		createdOn: new Date(),
		commandGroup: "kings++",
		output: new Map([
			[
				"notPermitted",
				{
					message: "",
					active: false,
				},
			],
			[
				"noGame",
				{
					message: "No active game",
					active: true,
				},
			],
			[
				"remaining",
				{
					message:
						"Cards remaining in this game {remaining}, !kings to draw a card",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"remaining",
				{
					isArgumentOptional: true,
					hasArgument: false,
					isArgumentNumber: false,
					description: "Checks how many cards are remaining in the !Kings game",
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
