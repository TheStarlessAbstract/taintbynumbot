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
				"randomNotFound",
				{
					message: "Could not find a random {chatNameFirstLetterUppercase}",
					active: true,
				},
			],
			[
				"stringNotFound",
				{
					message: "Could not find a {chatNameFirstLetterUppercase}",
					active: true,
				},
			],
			[
				"idNotFound",
				{
					message: "No {chatNameFirstLetterUppercase} for index number {index}",
					active: true,
				},
			],
			[
				"found",
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
			[
				"notPermitted",
				{
					message: "@{displayName} - you can't use this command",
					active: false,
				},
			],
		]),
		versions: new Map([
			[
				"getRandom",
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
						length: 4000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster", "mods"],
					},
				},
			],
			[
				"getRandomByString",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Gets a random Quote that contains a supplied string",
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
						length: 4000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster", "mods"],
					},
				},
			],
			[
				"getByIndex",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: true,
					description: "Gets a Quote with supplied index",
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
						length: 4000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster", "mods"],
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
