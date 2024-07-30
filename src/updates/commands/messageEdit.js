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
		chatName: "editmessage",
		type: "messageedit",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"messageExists",
				{
					message: "This Message already exists",
					active: true,
				},
			],
			[
				"updated",
				{
					message: "Message updated",
					active: true,
				},
			],
			[
				"notPermitted",
				{
					message: "User not premitted to add {chatNameFirstLetterUppercase}",
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
				"currentMessageText",
				{
					message: "It already says this",
					active: true,
				},
			],
			[
				"doesNotExist",
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
				"editMessage",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Edits and existing Message",
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
