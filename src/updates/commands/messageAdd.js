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
		chatName: "addmessage",
		type: "messageadd",
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
				"added",
				{
					message: "Message added",
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
				"noMessage",
				{
					message: "You need to include a Message to add",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"addMessage",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Adds a new Message for the bot to say",
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
