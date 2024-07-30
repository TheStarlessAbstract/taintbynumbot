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
		chatName: "kingsreset++",
		type: "cardgamereset",
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
				"reset",
				{
					message: "New game has been dealt",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"reset",
				{
					isArgumentOptional: true,
					hasArgument: false,
					isArgumentNumber: false,
					description: "Reset !Kings game",
					active: true,
					usableBy: ["broadcaster"],
					cooldown: {
						length: 10000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster"],
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
