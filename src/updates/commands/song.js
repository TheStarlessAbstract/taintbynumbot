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
		chatName: "song",
		type: "song",
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
				"listeningTo",
				{
					message:
						"The song playing is: {songTitle} by {artist}. Link: {spotifyUrl}",
					active: true,
				},
			],
			[
				"noStream",
				{
					message: "Stream is currently offline",
					active: true,
				},
			],
			[
				"noMusic",
				{
					message: "No tunes on Spotify currently",
					active: true,
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
				"getCurrentlyPlaying",
				{
					isArgumentOptional: false,
					hasArgument: false,
					isArgumentNumber: false,
					description: "Gets current playing song",
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
						length: 30000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster", "mods", "vips"],
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
