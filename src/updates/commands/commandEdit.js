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
		chatName: "editcomm",
		type: "commandedit",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"notPermitted",
				{
					message: "User not premitted to edit {chatNameFirstLetterUppercase}",
					active: false,
				},
			],
			[
				"noPrefix",
				{
					message:
						"You must include ! at the start of name of the command to edit",
					active: true,
				},
			],
			[
				"notFound",
				{
					message: "No command found by that name",
					active: true,
				},
			],
			[
				"notEditable",
				{
					message: "Command can't be edited through chat",
					active: true,
				},
			],
			[
				"currentText",
				{
					message: "Command already says this",
					active: true,
				},
			],
			[
				"edited",
				{
					message: "Command has been edited",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"editCommand",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Edits Command",
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
