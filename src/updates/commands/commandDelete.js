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
		chatName: "delcomm",
		type: "commanddelete",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"notPermitted",
				{
					message: "User not premitted to add {chatNameFirstLetterUppercase}",
					active: false,
				},
			],
			[
				"noPrefix",
				{
					message: "You must include ! at the start of name of the new command",
					active: true,
				},
			],
			[
				"notDeleted",
				{
					message: "No command found by that name",
					active: true,
				},
			],
			[
				"deleted",
				{
					message: "Command has been deleted",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"deleteCommand",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Deletes Command",
					active: true,
					usableBy: ["broadcaster", "mods"],
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
