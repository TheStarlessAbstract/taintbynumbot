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
		chatName: "delmessage",
		type: "messagedelete",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"deleted",
				{
					message: "Message deleted",
					active: true,
				},
			],
			[
				"notPermitted",
				{
					message: "User not premitted to delete Messages",
					active: false,
				},
			],
			[
				"noArgument",
				{
					message: "You need to include a Message to edit",
					active: true,
				},
			],
			[
				"notFound",
				{
					message: "Message number not found",
					active: true,
				},
			],
			[
				"error",
				{
					message: "error",
					active: false,
				},
			],
		]),
		versions: new Map([
			[
				"deleteMessage",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: true,
					description: "Deletes and existing Message",
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
