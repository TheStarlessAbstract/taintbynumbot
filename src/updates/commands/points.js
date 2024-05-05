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
		chatName: "points",
		type: "points",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"userNotFound",
				{
					message:
						"@{displayName} I hate to say it, but it looks like you haven't been here for a whole 5 minutes yet. Hang around a bit longer to get your self some Tainty Points.",
					active: true,
				},
			],
			[
				"userPoints",
				{
					message: "@{displayName}: You have {points} Tainty Points",
					active: true,
				},
			],
			[
				"noParams",
				{
					message: "",
					active: false,
				},
			],
			[
				"gifted",
				{
					message:
						"Our glorious leader Starless, has given @{giftTo} {giftAmount} Tainty Points",
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
				"getUserPoints",
				{
					isArgumentOptional: false,
					hasArgument: false,
					isArgumentNumber: false,
					description: "Gets current game category for the stream",
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
						length: 5000,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster", "mods"],
					},
				},
			],
			[
				"giveUserPoints",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Sets the currenty game category for the stream",
					active: true,
					usableBy: ["broadcaster"],
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
