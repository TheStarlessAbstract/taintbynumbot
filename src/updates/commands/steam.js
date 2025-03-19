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
				"idError",
				{
					message:
						"@{displayName} - Steam couldn't find your name, please check your Steam profile custom URL via Steam Profile > Edit Profile > Custom URL",
					active: true,
				},
			],
			[
				"privateError",
				{
					message:
						"@{displayName} - Your games are private, so I can't suggest a game. Go to Steam profile > Edit Profile > Privacy Settings. Set My Profile, and Game Details to Public",
					active: true,
				},
			],
			[
				"timePlayed",
				{
					message:
						"@{displayName} - you haven't played more than {hours} hour(s) in {game}, why not play it next",
					active: true,
				},
			],
			[
				"achievements%",
				{
					message:
						"@{displayName} - you haven't unlocked more than {percent} in {game}, go get that 100%",
					active: true,
				},
			],
			[
				"randomGame",
				{
					message:
						"@{displayName} - Can't choose what to play? Why not try {game}",
					active: true,
				},
			],
			[
				"noGames",
				{
					message:
						"@{displayName} - I couldn't find any games in your Steam library",
					active: true,
				},
			],
			[
				"noMatch",
				{
					message:
						"@{displayName} - I couldn't find any games that match your request",
					active: true,
				},
			],
			[
				"invalidOption",
				{
					message: "@{displayName} - Invalid option, please try again",
					active: true,
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
