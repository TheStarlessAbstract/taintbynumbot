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
		chatName: "followage",
		type: "followage",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"following",
				{
					message:
						"@{displayName} has been staring into the Abstract abyss for {followLength}",
					active: true,
				},
			],
			[
				"notFollowing",
				{
					message:
						"@{displayName} hit that follow button, otherwise this command is doing a whole lot of nothing for you",
					active: true,
				},
			],
			[
				"error",
				{
					message: "Error",
					active: false,
				},
			],
		]),
		versions: new Map([
			[
				"getFollowLength",
				{
					isArgumentOptional: true,
					hasArgument: false,
					isArgumentNumber: false,
					description:
						"How long has it been since you last unfollowed, and then refollowed",
					active: true,
					usableBy: ["artists", "founders", "mods", "subs", "vips", "viewers"],
					cooldown: {
						length: 5000,
						lastUsed: new Date(),
						bypassRoles: ["mods"],
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
