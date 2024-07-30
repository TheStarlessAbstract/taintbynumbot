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
		chatName: "steam",
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
					message:
						"@{userName} - Steam couldn't find your name, please check your Steam profile custom URL via Steam Profile > Edit Profile > Custom URL",
					active: true,
				},
			],
			[
				"privateError",
				{
					message:
						"@{userName} - Your games are private, so I can't suggest a game. Go to Steam profile > Edit Profile > Privacy Settings. Set My Profile, and Game Details to Public",
					active: true,
				},
			],
			[
				"timePlayed",
				{
					message:
						"@{userName} - you haven't played more than {hours} hour(s) in {game}, why not play it next",
					active: true,
				},
			],
			[
				"achievements%",
				{
					message:
						"@{userName} - you haven't unlocked more than {percent} in {game}, go get that 100%",
					active: true,
				},
			],
			[
				"randomGame",
				{
					message:
						"@{userName} - Can't choose what to play? Why not try {game}",
					active: false,
				},
			],
			[
				"noGames",
				{
					message:
						"@{userName} - I couldn't find any games in your Steam library",
					active: false,
				},
			],
			[
				"noMatch",
				{
					message:
						"@{userName} - I couldn't find any games that match your request",
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
					description: "Suggests a game from users Steam library",
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
