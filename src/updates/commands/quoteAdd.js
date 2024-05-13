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
		chatName: "addquote",
		type: "listadd",
		createdBy: twitchId,
		createdOn: new Date(),
		listTypeName: "quote",
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
		]),
		versions: new Map([
			[
				"addItem",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Adds a new Quote",
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
