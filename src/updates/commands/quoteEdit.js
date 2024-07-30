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
		chatName: "editquote",
		type: "listedit",
		createdBy: twitchId,
		createdOn: new Date(),
		commandGroup: "quote",
		output: new Map([
			[
				"notPermitted",
				{
					message: "User not premitted to add {chatNameFirstLetterUppercase}",
					active: false,
				},
			],
			[
				"invalidIndex",
				{
					message: "Invalid {chatNameFirstLetterUppercase}index provided",
					active: true,
				},
			],
			[
				"invalidText",
				{
					message: "Invalid {chatNameFirstLetterUppercase} text provided",
					active: true,
				},
			],
			[
				"notFound",
				{
					message: "{chatNameFirstLetterUppercase} number {index} not found",
					active: true,
				},
			],
			[
				"currentText",
				{
					message: "{chatNameFirstLetterUppercase} already says {updateText}",
					active: true,
				},
			],
			[
				"updated",
				{
					message: "{chatNameFirstLetterUppercase} updated",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"editItem",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Edits a Quote",
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
