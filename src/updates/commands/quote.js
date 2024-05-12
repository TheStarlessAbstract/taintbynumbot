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
		chatName: "quote",
		type: "list",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"noneFound",
				{
					message: "Could not find a random {item}",
					active: true,
				},
			],
			[
				"randomFound",
				{
					message: "{index}. {text}",
					active: true,
				},
			],
			[
				"error",
				{
					message: "Error has happened",
					active: false,
				},
			],
		]),
		versions: new Map([
			[
				"getRandomFromList",
				{
					isArgumentOptional: false,
					hasArgument: false,
					isArgumentNumber: false,
					description: "Gets a random Quote",
					active: true,
					usableBy: [
						"broadcaster",
						"artists",
						"founders",
						"mods",
						"subs",
						"vips",
						"viewers",
					],
					cooldown: {
						length: 10000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster", "mods"],
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
