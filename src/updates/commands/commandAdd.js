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
		chatName: "addcomm",
		type: "commandadd",
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
				"noText",
				{
					message: "You must include some text for the command to respond with",
					active: true,
				},
			],
			[
				"alreadyExists",
				{
					message: "A command already exists with this name",
					active: true,
				},
			],
			[
				"created",
				{
					message: "New command created",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"addCommand",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Creates a new Command",
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
