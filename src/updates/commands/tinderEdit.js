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
		chatName: "edittinder",
		type: "listedit",
		createdBy: twitchId,
		createdOn: new Date(),
		listTypeName: "tinder",
		output: new Map([
			[
				"alreadyExists",
				{
					message: "This {item} has already been added",
					active: true,
				},
			],
			[
				"added",
				{
					message: "{item} added: ",
					active: true,
				},
			],
			[
				"notPermitted",
				{
					message: "User not premitted to add {item}",
					active: false,
				},
			],
			[
				"invalidIndex",
				{
					message: "Invalid index provided",
					active: true,
				},
			],
			[
				"invalidText",
				{
					message: "Invalid {item} text provided",
					active: true,
				},
			],
			[
				"notFound",
				{
					message: "{item} number {index} not found",
					active: true,
				},
			],
			[
				"currentText",
				{
					message: "{item} already says {updateText}",
					active: true,
				},
			],
			[
				"updated",
				{
					message: "{item} updated",
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
					description: "Edits a Tinder bio",
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
