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
		chatName: "game",
		type: "game",
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
					message: "@{displayName} -> {channelName} is playing {gameName}",
					active: true,
				},
			],
			[
				"gameNotFound",
				{
					message: "@{displayName} no game found by that name.",
					active: true,
				},
			],
			[
				"updateGame",
				{
					message:
						"@{displayName} -> The stream game has been set to: {newGameName}",
					active: true,
				},
			],
			[
				"existingGame",
				{
					message: "",
					active: false,
				},
			],
			[
				"error",
				{
					message: "",
					active: false,
				},
			],
		]),
		versions: new Map([
			[
				"noArgument",
				{
					isArgumentOptional: false,
					hasArgument: false,
					isArgumentNumber: false,
					description: "Gets the game category for the stream",
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
				"stringArgument",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Updates the game category for the stream",
					active: true,
					usableBy: ["broadcaster", "mods"],
					cooldown: {
						length: 5000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster"],
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
