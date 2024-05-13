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
		chatName: "delquote",
		type: "listdelete",
		createdBy: twitchId,
		createdOn: new Date(),
		listTypeName: "quote",
		output: new Map([
			[
				"notPermitted",
				{
					message: "Not permitted",
					active: false,
				},
			],
			[
				"notDeleted",
				{
					message: "{item} was not deleted",
					active: true,
				},
			],
			[
				"deleted",
				{
					message: "{item} number {index} has been deleted ",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"deleteItem",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: true,
					description: "Deletes a Quote",
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
