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
		chatName: "buhhs",
		type: "text",
		createdBy: twitchId,
		createdOn: new Date(),
		output: new Map([
			[
				"text",
				{
					message:
						"buhhsbot is a super amazing bot made by the super amazing @asdfWENDYfdsa Go to https://www.twitch.tv/buhhsbot, and type !join in chat to have buhhsbot bootify your chat",
					active: true,
				},
			],
		]),
		versions: new Map([
			[
				"sayToChat",
				{
					isArgumentOptional: false,
					hasArgument: false,
					isArgumentNumber: false,
					description: "For the glory of buhhs",

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
						length: 0,
						lastUsed: new Date(),
						bypassRoles: ["broadcaster"],
					},
					cost: { active: false, points: 0, bypassRoles: ["broadcaster"] },
					hasAudioClip: false,
					luck: {
						active: false,
						odds: 100000,
					},
				},
			],
		]),
	});
}

module.exports = copyAndUpdate;
