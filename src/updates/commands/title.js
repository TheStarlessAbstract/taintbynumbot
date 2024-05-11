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
		chatName: "title",
		type: "title",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"noStream",
				{
					message:
						"@{displayName} - {channelName} doesn't seem to be streaming right now",
					active: true,
				},
			],
			[
				"streamIsLive",
				{
					message: "@{displayName} - The current stream title is: {title}",
					active: true,
				},
			],
			[
				"existingTitle",
				{
					message: "",
					active: false,
				},
			],
			[
				"updateTitle",
				{
					message: "@{displayName} - Title has been set to: {newTitle}",
					active: true,
				},
			],
			[
				"error",
				{
					message: "@{displayName} - There was an error in updating the title",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"getStreamTitle",
				{
					isArgumentOptional: false,
					hasArgument: false,
					isArgumentNumber: false,
					description: "Gets current title for the stream",
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
			[
				"setStreamTitle",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Updates the title for the stream",
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
