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
		chatName: "so",
		type: "shoutout",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"modsOnly",
				{
					message: "@{displayName} !{chatName} is for Mods only",
					active: true,
				},
			],
			[
				"shoutoutAndStreams",
				{
					message: "@{user} last streamed ${game}. I hear they love the Taint!",
					active: true,
				},
			],
			[
				"shoutoutNoStreams",
				{
					message: "Check out @{user}. I hear they love the Taint!",
					active: true,
				},
			],
			[
				"notFound",
				{
					message: "Couldn't find a user by the name of {user}",
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
				"stringArgument",
				{
					isArgumentOptional: false,
					hasArgument: true,
					isArgumentNumber: false,
					description: "Gives a shoutout to some wonderful user",
					active: true,
					usableBy: ["broadcaster", "mods"],
					cooldown: {
						length: 10000,
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
