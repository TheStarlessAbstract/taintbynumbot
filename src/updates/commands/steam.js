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
		chatName: "steambitch",
		type: "steam",
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
				"noStream",
				{
					message: "Stream is currently offline",
					active: true,
				},
			],
			[
				"idError",
				{
					message: "idError",
					active: true,
				},
			],

			[
				"privateError",
				{
					message: "No games found",
					active: true,
				},
			],
			[
				"timePlayed",
				{
					message: "{game} - time played",
					active: false,
				},
			],
			[
				"achievements%",
				{
					message: "{game} - achievements%",
					active: false,
				},
			],
			[
				"randomGame",
				{
					message: "{game} - randomGame",
					active: false,
				},
			],
		]),
		versions: new Map([
			[
				"suggestGame",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Suggests a song from users steam library",
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
